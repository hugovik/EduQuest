import pytest
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.database import Base
from app.models.quest import Quest
from app.models.quest_completion import QuestCompletion
from app.models.reading_progress import ReadingProgress
from app.repositories.child_repository import ChildRepository
from app.repositories.inventory_repository import InventoryRepository
from app.repositories.world_state_repository import WorldStateRepository
from app.repositories.world_quest_repository import WorldQuestRepository
from app.services.adventure_progress_summary_service import AdventureProgressSummaryService
from app.services.adventure_unlock_service import AdventureUnlockService
from app.services.inventory_service import InventoryService
from app.services.world_service import WorldService
from app.services.world_quest_service import WORLD_QUEST_REWARD_XP, WorldQuestService


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
    inventory_service = InventoryService(
        child_repository=child_repository,
        inventory_repository=InventoryRepository(),
    )
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
        world_quest_service=WorldQuestService(
            child_repository=child_repository,
            world_quest_repository=WorldQuestRepository(),
            inventory_service=inventory_service,
        ),
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
    assert state["overarching_quest"]["quest_key"] == "restore_eduquest_magic"
    assert state["quest_status"] == "not_started"
    assert state["quest_progress_percent"] == 0
    assert any(region["region_key"] == "math" for region in state["regions"])
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
    assert "visit_math" in state["overarching_quest"]["completed_steps"]


def test_travel_to_reading_persists_and_updates_visited_regions(db_session, world_service):
    state = world_service.travel(db_session, "reading")
    reloaded_state = world_service.get_state(db_session)

    assert state["active_location"] == "reading"
    assert reloaded_state["active_location"] == "reading"
    assert state["last_region"] == "reading"
    assert state["visited_regions"] == ["reading"]
    assert "visit_reading" in state["overarching_quest"]["completed_steps"]


def test_invalid_location_rejected(db_session, world_service):
    with pytest.raises(HTTPException) as exc_info:
        world_service.travel(db_session, "unknown")

    assert exc_info.value.status_code == 400


def test_travel_to_coming_soon_region_is_blocked(db_session, world_service):
    with pytest.raises(HTTPException) as exc_info:
        world_service.travel(db_session, "writing")

    assert exc_info.value.status_code == 403
    assert exc_info.value.detail == "Writing Kingdom is coming soon."


def test_world_state_includes_progress_summary_and_unlocks(db_session, world_service):
    state = world_service.get_state(db_session)

    assert "math" in state["progress_summary"]
    assert "reading" in state["progress_summary"]
    assert state["unlocks"]["math"]["unlocked"] is True
    assert state["unlocks"]["reading"]["unlocked"] is True
    assert state["regions"][0]["region_key"] == "treehouse"
    assert any(region["coming_soon"] for region in state["regions"] if region["region_key"] == "writing")
    assert state["overarching_quest"]["title"] == "Restore the EduQuest World"
    assert len(state["quest_steps"]) == 4


def test_world_progress_summary_returns_parent_visible_world_progress(db_session, world_service):
    child = ChildRepository().create_default_child(db_session)
    quest = Quest(
        id="math-summary-test",
        title="Math Summary Test",
        realm="Math Mountains",
        subject="math",
        xp_reward=25,
    )
    db_session.add(quest)
    db_session.flush()
    db_session.add(QuestCompletion(child_id=child.id, quest_id=quest.id, xp_awarded=25))
    db_session.add(
        ReadingProgress(
            child_id=child.id,
            passage_id="reading-l2-01",
            level=2,
            questions_answered=4,
            correct_answers=3,
            vocabulary_learned=2,
            xp_awarded=15,
            completed=True,
        )
    )
    db_session.commit()

    world_service.travel(db_session, "math")
    state = world_service.travel(db_session, "reading")
    summary = world_service.get_progress_summary(db_session)

    assert summary["active_location"] == "reading"
    assert summary["last_region"] == "reading"
    assert summary["visited_regions"] == ["math", "reading"]
    assert summary["total_regions"] == 6
    assert summary["unlocked_regions"] == 2
    assert summary["completed_regions"] >= 1
    assert summary["world_quest"]["title"] == "Restore the EduQuest World"
    assert summary["world_quest"]["progress_percent"] == state["quest_progress_percent"]
    assert summary["world_quest"]["status"] == "completed"
    assert summary["inventory_count"] == 1
    assert summary["math"]["completed_quests"] == 1
    assert summary["reading"]["completed_quests"] == 1


def test_repeated_travel_does_not_duplicate_visited_regions(db_session, world_service):
    world_service.travel(db_session, "math")
    state = world_service.travel(db_session, "math")

    assert state["visited_regions"] == ["math"]


def test_math_progress_milestone_updates_world_quest_step(db_session, world_service):
    child = ChildRepository().create_default_child(db_session)
    quest = Quest(
        id="math-test",
        title="Math Test",
        realm="Math Mountains",
        subject="math",
        xp_reward=25,
    )
    db_session.add(quest)
    db_session.flush()
    db_session.add(QuestCompletion(child_id=child.id, quest_id=quest.id, xp_awarded=25))
    db_session.commit()

    state = world_service.get_state(db_session)

    assert "complete_math_milestone" in state["overarching_quest"]["completed_steps"]


def test_reading_progress_milestone_updates_world_quest_step(db_session, world_service):
    child = ChildRepository().create_default_child(db_session)
    db_session.add(
        ReadingProgress(
            child_id=child.id,
            passage_id="reading-l2-01",
            level=2,
            questions_answered=4,
            correct_answers=3,
            vocabulary_learned=2,
            xp_awarded=15,
            completed=True,
        )
    )
    db_session.commit()

    state = world_service.get_state(db_session)

    assert "complete_reading_milestone" in state["overarching_quest"]["completed_steps"]


def test_world_quest_completion_awards_reward_once(db_session, world_service):
    child = ChildRepository().create_default_child(db_session)
    quest = Quest(
        id="math-test",
        title="Math Test",
        realm="Math Mountains",
        subject="math",
        xp_reward=25,
    )
    db_session.add(quest)
    db_session.flush()
    db_session.add(QuestCompletion(child_id=child.id, quest_id=quest.id, xp_awarded=25))
    db_session.add(
        ReadingProgress(
            child_id=child.id,
            passage_id="reading-l2-01",
            level=2,
            questions_answered=4,
            correct_answers=3,
            vocabulary_learned=2,
            xp_awarded=15,
            completed=True,
        )
    )
    db_session.commit()

    world_service.travel(db_session, "math")
    state = world_service.travel(db_session, "reading")
    db_session.refresh(child)
    xp_after_completion = child.xp
    inventory_items = state["inventory"]["items"]

    assert state["quest_status"] == "completed"
    assert xp_after_completion == 40 + WORLD_QUEST_REWARD_XP
    assert [item["item_key"] for item in inventory_items].count("world_heart") == 1

    state = world_service.get_state(db_session)
    db_session.refresh(child)

    assert child.xp == xp_after_completion
    assert [item["item_key"] for item in state["inventory"]["items"]].count("world_heart") == 1
