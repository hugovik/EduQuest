import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.database import Base
from app.models import AchievementUnlock, Quest, QuestCompletion
from app.repositories.child_repository import ChildRepository
from app.services.adventure_progress_summary_service import (
    ADVENTURE_TYPES,
    AdventureProgressSummaryService,
)
from app.services.adventure_unlock_service import AdventureUnlockService


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
def unlock_service():
    child_repository = ChildRepository()
    return AdventureUnlockService(
        child_repository=child_repository,
        progress_summary_service=AdventureProgressSummaryService(
            child_repository=child_repository,
        ),
    )


def seed_quest(db_session, quest_id, subject, xp_reward=25):
    quest = Quest(
        id=quest_id,
        title=quest_id,
        realm=subject,
        subject=subject,
        xp_reward=xp_reward,
        repeatable=True,
    )
    db_session.add(quest)
    db_session.commit()
    return quest


def complete_quest(db_session, child_id, quest, xp_awarded=None):
    db_session.add(
        QuestCompletion(
            child_id=child_id,
            quest_id=quest.id,
            xp_awarded=xp_awarded if xp_awarded is not None else quest.xp_reward,
        )
    )
    db_session.commit()


def test_default_adventures_are_unlocked(db_session, unlock_service):
    unlocks = unlock_service.get_unlocks(db_session)

    assert unlocks["math"]["unlocked"] is True
    assert unlocks["reading"]["unlocked"] is True
    assert unlocks["writing"]["unlocked"] is True


def test_locked_adventure_returns_reason(db_session, unlock_service):
    unlocks = unlock_service.get_unlocks(db_session)

    assert unlocks["story"]["unlocked"] is False
    assert "Reading Forest" in unlocks["story"]["reason"]
    assert unlocks["story"]["current"] == 0
    assert unlocks["story"]["required"] == 3


def test_story_unlocks_after_reading_requirement(db_session, unlock_service):
    child = unlock_service.get_child_or_create_default(db_session)

    for index in range(3):
        quest = seed_quest(db_session, f"reading-{index}", "reading")
        complete_quest(db_session, child.id, quest)

    unlocks = unlock_service.get_unlocks(db_session)

    assert unlocks["story"]["unlocked"] is True
    assert unlocks["story"]["current"] == 3


def test_science_unlocks_after_xp_requirement(db_session, unlock_service):
    child = unlock_service.get_child_or_create_default(db_session)
    quest = seed_quest(db_session, "math-xp", "math", xp_reward=100)
    complete_quest(db_session, child.id, quest, xp_awarded=100)

    unlocks = unlock_service.get_unlocks(db_session)

    assert unlocks["science"]["unlocked"] is True


def test_music_unlocks_after_first_achievement(db_session, unlock_service):
    child = unlock_service.get_child_or_create_default(db_session)
    db_session.add(AchievementUnlock(child_id=child.id, achievement_id="first-quest"))
    db_session.commit()

    unlocks = unlock_service.get_unlocks(db_session)

    assert unlocks["music"]["unlocked"] is True


def test_missing_progress_fails_safely(db_session):
    class BrokenProgressService:
        def get_summary(self, db):
            raise RuntimeError("missing progress")

    unlock_service = AdventureUnlockService(
        child_repository=ChildRepository(),
        progress_summary_service=BrokenProgressService(),
    )

    unlocks = unlock_service.get_unlocks(db_session)

    assert unlocks["math"]["unlocked"] is True
    assert unlocks["story"]["unlocked"] is False


def test_all_adventure_keys_returned(db_session, unlock_service):
    unlocks = unlock_service.get_unlocks(db_session)

    assert set(unlocks.keys()) == set(ADVENTURE_TYPES)
