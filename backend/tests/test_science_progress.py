import pytest
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.database import Base
from app.models.child import Child
from app.models.progress_event import ProgressEvent
from app.models.science_progress import ScienceProgress
from app.models.tree_growth_event import TreeGrowthEvent
from app.repositories.achievement_repository import AchievementRepository
from app.repositories.child_repository import ChildRepository
from app.repositories.inventory_repository import InventoryRepository
from app.services.achievement_service import AchievementService
from app.services.adventure_completion_service import AdventureCompletionService
from app.services.adventure_progress_summary_service import AdventureProgressSummaryService
from app.services.inventory_service import InventoryService
from app.services.science_service import ScienceService


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
def science_service():
    return ScienceService(
        child_repository=ChildRepository(),
        completion_service=AdventureCompletionService(),
        achievement_service=AchievementService(
            child_repository=ChildRepository(),
            achievement_repository=AchievementRepository(),
        ),
        inventory_service=InventoryService(
            child_repository=ChildRepository(),
            inventory_repository=InventoryRepository(),
        ),
    )


def test_science_completion_awards_xp_once(db_session, science_service):
    starting_xp = science_service.get_child_or_create_default(db_session).xp
    result = science_service.complete_experiment(db_session, "electricity-1")
    child = db_session.query(Child).one()

    assert result["xp_awarded"] == 10
    assert result["already_completed"] is False
    assert child.xp == starting_xp + 10
    assert db_session.query(ScienceProgress).count() == 1
    assert db_session.query(ProgressEvent).count() == 1
    assert db_session.query(TreeGrowthEvent).count() == 1

    replay = science_service.complete_experiment(db_session, "electricity-1")
    db_session.refresh(child)

    assert replay["xp_awarded"] == 0
    assert replay["already_completed"] is True
    assert child.xp == starting_xp + 10
    assert db_session.query(ScienceProgress).count() == 1
    assert db_session.query(ProgressEvent).count() == 1
    assert db_session.query(TreeGrowthEvent).count() == 1


def test_science_first_experiment_achievement_unlocks_once(db_session, science_service):
    result = science_service.complete_experiment(db_session, "electricity-1")
    replay = science_service.complete_experiment(db_session, "electricity-1")

    assert [achievement.id for achievement in result["achievements_unlocked"]] == [
        "science-first-experiment"
    ]
    assert replay["achievements_unlocked"] == []


def test_science_progress_persists_completed_experiments(db_session, science_service):
    science_service.complete_experiment(db_session, "electricity-1")
    science_service.complete_experiment(db_session, "electricity-2")

    progress = science_service.get_progress(db_session)

    assert progress["completed_experiments"] == ["electricity-1", "electricity-2"]
    assert progress["experiments_completed"] == 2
    assert progress["total_experiments"] == 10
    assert progress["xp_earned"] == 20
    assert len(progress["topics"]) == 2
    assert progress["topics"][0]["id"] == "electricity"
    assert progress["topics"][0]["completed_experiments"] == 2
    assert progress["topics"][0]["total_experiments"] == 5


def test_adventure_summary_includes_science_xp_and_completion(db_session, science_service):
    summary_service = AdventureProgressSummaryService(child_repository=ChildRepository())
    science_service.complete_experiment(db_session, "electricity-1")

    summary = summary_service.get_summary(db_session)

    assert summary["science"]["completed_quests"] == 1
    assert summary["science"]["total_quests"] == 10
    assert summary["science"]["xp_earned"] == 10
    assert summary["science"]["status"] == "in_progress"


def test_magnetism_first_experiment_is_open_by_default(db_session, science_service):
    result = science_service.complete_experiment(db_session, "magnets-1")

    assert result["completed"] is True
    assert result["xp_awarded"] == 10
    assert result["already_completed"] is False


def test_magnetism_lessons_unlock_sequentially(db_session, science_service):
    science_service.complete_experiment(db_session, "magnets-1")

    with pytest.raises(HTTPException) as exc_info:
        science_service.complete_experiment(db_session, "magnets-3")

    assert exc_info.value.status_code == 403
    assert "Complete Magnetic or Not?" in exc_info.value.detail

    science_service.complete_experiment(db_session, "magnets-2")
    result = science_service.complete_experiment(db_session, "magnets-3")

    assert result["completed"] is True
    assert result["xp_awarded"] == 10


def test_invalid_science_experiment_is_rejected_without_progress(db_session, science_service):
    with pytest.raises(HTTPException) as exc_info:
        science_service.complete_experiment(db_session, "unknown-science")

    assert exc_info.value.status_code == 404
    assert db_session.query(Child).count() == 0
    assert db_session.query(ScienceProgress).count() == 0
    assert db_session.query(ProgressEvent).count() == 0
    assert db_session.query(TreeGrowthEvent).count() == 0


def test_completing_electricity_and_magnetism_updates_completed_count(
    db_session,
    science_service,
):
    science_service.complete_experiment(db_session, "electricity-1")
    science_service.complete_experiment(db_session, "magnets-1")

    progress = science_service.get_progress(db_session)

    assert progress["experiments_completed"] == 2
    assert progress["total_experiments"] == 10
    assert progress["xp_earned"] == 20


def test_four_of_five_electricity_missions_do_not_complete_topic(db_session, science_service):
    for experiment_id in [
        "electricity-1",
        "electricity-2",
        "electricity-3",
        "electricity-4",
    ]:
        science_service.complete_experiment(db_session, experiment_id)

    progress = science_service.get_progress(db_session)
    electricity = next(topic for topic in progress["topics"] if topic["id"] == "electricity")

    assert electricity["completed"] is False
    assert electricity["completed_experiments"] == 4
    assert electricity["reward_earned"] is False


def test_electricity_topic_completion_awards_reward_and_achievement_once(db_session, science_service):
    for experiment_id in [
        "electricity-1",
        "electricity-2",
        "electricity-3",
        "electricity-4",
    ]:
        science_service.complete_experiment(db_session, experiment_id)

    result = science_service.complete_experiment(db_session, "electricity-5")

    assert result["topic_completed"] is True
    assert result["topic_id"] == "electricity"
    assert result["topic_reward"]["item_key"] == "lightning_crystal"
    assert [achievement.id for achievement in result["new_achievements"]] == [
        "science_electricity_master"
    ]

    replay = science_service.complete_experiment(db_session, "electricity-5")

    assert replay["already_completed"] is True
    assert replay["xp_awarded"] == 0
    assert replay["topic_completed"] is True
    assert replay["topic_reward"] is None

    inventory = science_service.inventory_service.get_inventory(db_session)
    lightning_items = [
        item for item in inventory["items"] if item["item_key"] == "lightning_crystal"
    ]

    assert len(lightning_items) == 1
    assert lightning_items[0]["quantity"] == 1


def test_magnetism_topic_completion_is_independent_of_electricity(db_session, science_service):
    for experiment_id in [
        "magnets-1",
        "magnets-2",
        "magnets-3",
        "magnets-4",
    ]:
        science_service.complete_experiment(db_session, experiment_id)

    result = science_service.complete_experiment(db_session, "magnets-5")
    progress = science_service.get_progress(db_session)
    electricity = next(topic for topic in progress["topics"] if topic["id"] == "electricity")
    magnetism = next(topic for topic in progress["topics"] if topic["id"] == "magnetism")

    assert result["topic_completed"] is True
    assert result["topic_id"] == "magnetism"
    assert result["topic_reward"]["item_key"] == "magnetic_compass"
    assert [achievement.id for achievement in result["new_achievements"]] == [
        "science_magnetism_master",
    ]
    assert electricity["completed"] is False
    assert magnetism["completed"] is True
    assert magnetism["reward_earned"] is True


def test_invalid_science_experiment_cannot_trigger_topic_reward(db_session, science_service):
    with pytest.raises(HTTPException):
        science_service.complete_experiment(db_session, "unknown-science")

    inventory = science_service.inventory_service.get_inventory(db_session)

    assert inventory["items"] == []
