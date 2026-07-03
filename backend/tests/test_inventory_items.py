import pytest
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.database import Base
from app.repositories.child_repository import ChildRepository
from app.repositories.inventory_repository import InventoryRepository
from app.repositories.world_state_repository import WorldStateRepository
from app.services.adventure_progress_summary_service import AdventureProgressSummaryService
from app.services.adventure_unlock_service import AdventureUnlockService
from app.services.inventory_service import InventoryService
from app.services.world_service import WorldService


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
def inventory_service():
    return InventoryService(
        child_repository=ChildRepository(),
        inventory_repository=InventoryRepository(),
    )


@pytest.fixture()
def world_service(inventory_service):
    child_repository = ChildRepository()
    progress_summary_service = AdventureProgressSummaryService(
        child_repository=child_repository,
    )
    adventure_unlock_service = AdventureUnlockService(
        child_repository=child_repository,
        progress_summary_service=progress_summary_service,
    )
    return WorldService(
        child_repository=child_repository,
        world_state_repository=WorldStateRepository(),
        inventory_repository=InventoryRepository(),
        inventory_service=inventory_service,
        progress_summary_service=progress_summary_service,
        adventure_unlock_service=adventure_unlock_service,
    )


def test_empty_inventory_returns_empty_items(db_session, inventory_service):
    inventory = inventory_service.get_inventory(db_session)

    assert inventory["items"] == []


def test_add_item_creates_item(db_session, inventory_service):
    item = inventory_service.add_item(
        db_session,
        child_id=None,
        item_key="reading_leaf",
        quantity=1,
        source_region="reading",
    )

    assert item["item_key"] == "reading_leaf"
    assert item["quantity"] == 1
    assert item["source_region"] == "reading"


def test_adding_same_item_increases_quantity(db_session, inventory_service):
    inventory_service.add_item(db_session, None, "reading_leaf", quantity=1)
    item = inventory_service.add_item(db_session, None, "reading_leaf", quantity=2)

    assert item["quantity"] == 3


def test_consume_item_decreases_quantity(db_session, inventory_service):
    inventory_service.add_item(db_session, None, "reading_leaf", quantity=3)
    item = inventory_service.consume_item(db_session, None, "reading_leaf", quantity=2)

    assert item["quantity"] == 1


def test_cannot_consume_below_zero(db_session, inventory_service):
    inventory_service.add_item(db_session, None, "reading_leaf", quantity=1)

    with pytest.raises(HTTPException) as exc_info:
        inventory_service.consume_item(db_session, None, "reading_leaf", quantity=2)

    assert exc_info.value.status_code == 400


def test_world_state_includes_inventory_items(db_session, inventory_service, world_service):
    inventory_service.add_item(db_session, None, "forest_gem", quantity=1, source_region="reading")

    state = world_service.get_state(db_session)

    assert state["inventory"]["items"][0]["item_key"] == "forest_gem"


def test_add_item_once_does_not_regrant_after_consumed(db_session, inventory_service):
    child = inventory_service.get_child_or_create_default(db_session)
    first_item = inventory_service.add_item_once(
        db_session,
        child.id,
        "math_crystal",
        source_region="math",
    )
    inventory_service.consume_item(db_session, child.id, "math_crystal", quantity=1)
    second_item = inventory_service.add_item_once(
        db_session,
        child.id,
        "math_crystal",
        source_region="math",
    )

    assert first_item is not None
    assert second_item is None
