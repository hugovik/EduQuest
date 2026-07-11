from datetime import datetime

import pytest
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.content.treehouse_shortcut_registry import TREEHOUSE_SHORTCUTS
from app.database.database import Base
from app.models.child import Child
from app.models.reading_progress import ReadingProgress
from app.repositories.child_repository import ChildRepository
from app.repositories.inventory_repository import InventoryRepository
from app.repositories.treehouse_shortcut_repository import TreehouseShortcutRepository
from app.services.inventory_service import InventoryService
from app.services.treehouse_shortcut_service import TreehouseShortcutService


@pytest.fixture()
def db_session():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def shortcut_service():
    child_repository = ChildRepository()
    inventory_repository = InventoryRepository()
    inventory_service = InventoryService(
        child_repository=child_repository,
        inventory_repository=inventory_repository,
    )
    return TreehouseShortcutService(
        child_repository=child_repository,
        shortcut_repository=TreehouseShortcutRepository(),
        inventory_repository=inventory_repository,
        inventory_service=inventory_service,
    )


def add_completed_reading_passages(db, child_id, count):
    for index in range(count):
        db.add(
            ReadingProgress(
                child_id=child_id,
                passage_id=f"reading-l2-{index + 1:02d}",
                level=2,
                questions_answered=4,
                correct_answers=4,
                vocabulary_learned=2,
                xp_awarded=20,
                completed=True,
                completed_at=datetime.utcnow(),
            )
        )
    db.commit()


def add_reading_leaves(shortcut_service, db, child_id, quantity):
    return shortcut_service.inventory_service.add_item(
        db,
        child_id,
        "reading_leaf",
        quantity=quantity,
        source_region="reading",
    )


def get_leaf_quantity(shortcut_service, db, child_id):
    item = shortcut_service.inventory_repository.get_item(db, child_id, "reading_leaf")
    return item.quantity if item is not None else 0


def test_official_reading_shortcut_exists_in_registry():
    shortcut = TREEHOUSE_SHORTCUTS["reading-forest-shortcut"]

    assert shortcut["region_id"] == "reading"
    assert shortcut["maximum_stage"] == 4
    assert shortcut["stages"][0]["required_progress"] == 3


def test_unknown_shortcut_id_fails(db_session, shortcut_service):
    with pytest.raises(HTTPException) as exc_info:
        shortcut_service.get_shortcut(db_session, "missing-shortcut")

    assert exc_info.value.status_code == 404


def test_new_player_shortcut_is_locked(db_session, shortcut_service):
    shortcut = shortcut_service.get_shortcut(db_session, "reading-forest-shortcut")

    assert shortcut["stage"] == 0
    assert shortcut["eligible"] is False
    assert shortcut["status"] == "locked"
    assert shortcut["can_contribute"] is False


def test_three_reading_completions_make_shortcut_eligible(db_session, shortcut_service):
    child = shortcut_service.get_child_or_create_default(db_session)
    add_completed_reading_passages(db_session, child.id, 3)

    shortcut = shortcut_service.get_shortcut(db_session, "reading-forest-shortcut")

    assert shortcut["stage"] == 1
    assert shortcut["eligible"] is True
    assert shortcut["status"] == "eligible"
    assert shortcut["required_resource_id"] == "reading_leaf"


def test_contribution_fails_without_resource_and_does_not_advance(db_session, shortcut_service):
    child = shortcut_service.get_child_or_create_default(db_session)
    add_completed_reading_passages(db_session, child.id, 3)

    with pytest.raises(HTTPException) as exc_info:
        shortcut_service.contribute(db_session, "reading-forest-shortcut")

    shortcut = shortcut_service.get_shortcut(db_session, "reading-forest-shortcut")
    assert exc_info.value.status_code == 400
    assert shortcut["stage"] == 1
    assert get_leaf_quantity(shortcut_service, db_session, child.id) == 0


def test_valid_contribution_advances_one_stage_and_consumes_resource(db_session, shortcut_service):
    child = shortcut_service.get_child_or_create_default(db_session)
    add_completed_reading_passages(db_session, child.id, 3)
    add_reading_leaves(shortcut_service, db_session, child.id, 2)

    shortcut = shortcut_service.contribute(db_session, "reading-forest-shortcut")

    assert shortcut["stage"] == 2
    assert shortcut["completed"] is False
    assert get_leaf_quantity(shortcut_service, db_session, child.id) == 1


def test_progress_gate_prevents_early_next_stage_and_preserves_inventory(db_session, shortcut_service):
    child = shortcut_service.get_child_or_create_default(db_session)
    add_completed_reading_passages(db_session, child.id, 3)
    add_reading_leaves(shortcut_service, db_session, child.id, 3)
    shortcut_service.contribute(db_session, "reading-forest-shortcut")

    with pytest.raises(HTTPException) as exc_info:
        shortcut_service.contribute(db_session, "reading-forest-shortcut")

    shortcut = shortcut_service.get_shortcut(db_session, "reading-forest-shortcut")
    assert exc_info.value.status_code == 403
    assert shortcut["stage"] == 2
    assert get_leaf_quantity(shortcut_service, db_session, child.id) == 2


def test_final_contribution_completes_shortcut_and_blocks_duplicate(db_session, shortcut_service):
    child = shortcut_service.get_child_or_create_default(db_session)
    add_completed_reading_passages(db_session, child.id, 8)
    add_reading_leaves(shortcut_service, db_session, child.id, 4)

    shortcut_service.contribute(db_session, "reading-forest-shortcut")
    shortcut_service.contribute(db_session, "reading-forest-shortcut")
    complete = shortcut_service.contribute(db_session, "reading-forest-shortcut")
    leaves_after_completion = get_leaf_quantity(shortcut_service, db_session, child.id)

    with pytest.raises(HTTPException) as exc_info:
        shortcut_service.contribute(db_session, "reading-forest-shortcut")

    assert complete["stage"] == 4
    assert complete["completed"] is True
    assert complete["can_contribute"] is False
    assert exc_info.value.status_code == 409
    assert get_leaf_quantity(shortcut_service, db_session, child.id) == leaves_after_completion


def test_shortcut_state_reports_backend_authoritative_can_contribute(db_session, shortcut_service):
    child = shortcut_service.get_child_or_create_default(db_session)
    add_completed_reading_passages(db_session, child.id, 5)
    add_reading_leaves(shortcut_service, db_session, child.id, 1)

    shortcut = shortcut_service.get_shortcut(db_session, "reading-forest-shortcut")

    assert shortcut["can_contribute"] is True
    assert shortcut["action_label"] == "Build Next Stage"


def test_one_child_shortcut_progress_does_not_affect_another_child(db_session, shortcut_service):
    first_child = shortcut_service.get_child_or_create_default(db_session)
    second_child = Child(name="Kai", grade=2, level=1, xp=0, tree_stage="Seedling")
    db_session.add(second_child)
    db_session.commit()
    db_session.refresh(second_child)
    add_completed_reading_passages(db_session, first_child.id, 3)

    assert shortcut_service.count_completed_reading_passages(db_session, first_child.id) == 3
    assert shortcut_service.count_completed_reading_passages(db_session, second_child.id) == 0
