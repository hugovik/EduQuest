import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.database import Base
from app.models.quest import Quest
from app.repositories.achievement_repository import AchievementRepository
from app.repositories.child_repository import ChildRepository
from app.repositories.progress_event_repository import ProgressEventRepository
from app.repositories.quest_completion_repository import QuestCompletionRepository
from app.repositories.quest_repository import QuestRepository
from app.repositories.tree_growth_event_repository import TreeGrowthEventRepository
from app.services.adventure_progress_summary_service import AdventureProgressSummaryService
from app.services.adventure_unlock_service import AdventureUnlockService
from app.services.quest_service import QuestService


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
def progress_summary_service():
    return AdventureProgressSummaryService(
        child_repository=ChildRepository(),
    )


def seed_quest(db_session, quest_id="math-world-test", subject="math"):
    quest = Quest(
        id=quest_id,
        title="World Test Quest",
        realm="Math Mountains",
        subject=subject,
        xp_reward=25,
        repeatable=False,
    )
    db_session.add(quest)
    db_session.commit()
    return quest


def complete_quest(db_session, quest_id):
    service = QuestService(
        child_repository=ChildRepository(),
        quest_repository=QuestRepository(),
        quest_completion_repository=QuestCompletionRepository(),
        progress_event_repository=ProgressEventRepository(),
        tree_growth_event_repository=TreeGrowthEventRepository(),
        achievement_repository=AchievementRepository(),
    )
    return service.complete_quest(db_session, quest_id)


def test_adventure_progress_summary_returns_all_world_keys(db_session, progress_summary_service):
    summary = progress_summary_service.get_summary(db_session)

    assert set(summary.keys()) == {
        "math",
        "reading",
        "writing",
        "story",
        "geography",
        "science",
        "music",
    }
    assert summary["math"]["status"] == "not_started"


def test_adventure_progress_summary_uses_real_math_completion(db_session, progress_summary_service):
    quest = seed_quest(db_session)
    complete_quest(db_session, quest.id)

    summary = progress_summary_service.get_summary(db_session)

    assert summary["math"]["completed_quests"] == 1
    assert summary["math"]["total_quests"] == 1
    assert summary["math"]["xp_earned"] == 25
    assert summary["math"]["status"] == "completed"


def test_adventure_unlocks_default_and_locked_regions(db_session, progress_summary_service):
    unlock_service = AdventureUnlockService(
        child_repository=ChildRepository(),
        progress_summary_service=progress_summary_service,
    )

    unlocks = unlock_service.get_unlocks(db_session)

    assert unlocks["math"]["unlocked"] is True
    assert unlocks["reading"]["unlocked"] is True
    assert unlocks["science"]["unlocked"] is False
    assert unlocks["science"]["required"] == 100
