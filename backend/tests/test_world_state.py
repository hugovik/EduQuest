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
def world_service():
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
        progress_summary_service=progress_summary_service,
        adventure_unlock_service=adventure_unlock_service,
    )


def test_default_world_state_is_created(db_session, world_service):
    state = world_service.get_state(db_session)

    assert state["active_location"] == "treehouse"
    assert state["last_region"] is None
    assert state["visited_regions"] == []
    assert "math" in state["available_regions"]
    assert "math" in state["unlocked_regions"]
    assert "reading" in state["unlocked_regions"]
    assert state["inventory"]["bricks"] == 0
    assert state["inventory"]["coins"] == 0
    assert state["inventory"]["stars"] == 0
    assert state["inventory"]["items"] == []
    assert state["updated_at"] is not None


def test_travel_to_world_persists(db_session, world_service):
    state = world_service.travel(db_session, "world")
    reloaded_state = world_service.get_state(db_session)

    assert state["active_location"] == "world"
    assert reloaded_state["active_location"] == "world"
    assert state["last_region"] is None
    assert state["visited_regions"] == []


def test_travel_to_math_persists_and_updates_visited_regions(db_session, world_service):
    state = world_service.travel(db_session, "math")
    reloaded_state = world_service.get_state(db_session)

    assert state["active_location"] == "math"
    assert reloaded_state["active_location"] == "math"
    assert state["last_region"] == "math"
    assert state["visited_regions"] == ["math"]


def test_travel_to_reading_persists_and_updates_visited_regions(db_session, world_service):
    state = world_service.travel(db_session, "reading")
    reloaded_state = world_service.get_state(db_session)

    assert state["active_location"] == "reading"
    assert reloaded_state["active_location"] == "reading"
    assert state["last_region"] == "reading"
    assert state["visited_regions"] == ["reading"]


def test_invalid_location_rejected(db_session, world_service):
    with pytest.raises(HTTPException) as exc_info:
        world_service.travel(db_session, "science")

    assert exc_info.value.status_code == 400


def test_world_state_includes_progress_summary_and_unlocks(db_session, world_service):
    state = world_service.get_state(db_session)

    assert "math" in state["progress_summary"]
    assert "reading" in state["progress_summary"]
    assert state["unlocks"]["math"]["unlocked"] is True
    assert state["unlocks"]["reading"]["unlocked"] is True


def test_repeated_travel_does_not_duplicate_visited_regions(db_session, world_service):
    world_service.travel(db_session, "math")
    state = world_service.travel(db_session, "math")

    assert state["visited_regions"] == ["math"]
