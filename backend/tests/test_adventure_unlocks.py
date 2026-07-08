import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.database import Base
from app.models import AchievementUnlock, Quest, QuestCompletion
from app.repositories.child_repository import ChildRepository
from app.services.adventure_progress_summary_service import (
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
    assert unlocks["science"]["unlocked"] is True


def test_coming_soon_adventure_returns_reason(db_session, unlock_service):
    unlocks = unlock_service.get_unlocks(db_session)

    assert unlocks["geography"]["unlocked"] is False
    assert "Geography" in unlocks["geography"]["reason"]
    assert unlocks["geography"]["coming_soon"] is True


def test_future_regions_remain_coming_soon_even_when_future_gate_is_met(db_session, unlock_service):
    child = unlock_service.get_child_or_create_default(db_session)

    for index in range(3):
        quest = seed_quest(db_session, f"reading-{index}", "reading")
        complete_quest(db_session, child.id, quest)

    unlocks = unlock_service.get_unlocks(db_session)

    assert unlocks["writing"]["unlocked"] is True
    assert unlocks["writing"]["coming_soon"] is False
    assert unlocks["geography"]["unlocked"] is False
    assert unlocks["geography"]["coming_soon"] is True


def test_science_is_playable_after_xp_requirement(db_session, unlock_service):
    child = unlock_service.get_child_or_create_default(db_session)
    quest = seed_quest(db_session, "math-xp", "math", xp_reward=100)
    complete_quest(db_session, child.id, quest, xp_awarded=100)

    unlocks = unlock_service.get_unlocks(db_session)

    assert unlocks["science"]["unlocked"] is True
    assert unlocks["science"]["coming_soon"] is False


def test_music_stays_coming_soon_after_first_achievement(db_session, unlock_service):
    child = unlock_service.get_child_or_create_default(db_session)
    db_session.add(AchievementUnlock(child_id=child.id, achievement_id="first-quest"))
    db_session.commit()

    unlocks = unlock_service.get_unlocks(db_session)

    assert unlocks["music"]["unlocked"] is False
    assert unlocks["music"]["coming_soon"] is True


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
    assert unlocks["writing"]["unlocked"] is True
    assert unlocks["geography"]["unlocked"] is False


def test_all_adventure_keys_returned(db_session, unlock_service):
    unlocks = unlock_service.get_unlocks(db_session)

    assert set(unlocks.keys()) == {"math", "reading", "writing", "science", "geography", "music"}


def test_normalized_regions_return_world_region_state(db_session, unlock_service):
    regions = unlock_service.get_regions(db_session)
    by_key = {region["region_key"]: region for region in regions}

    assert by_key["treehouse"]["is_available"] is True
    assert by_key["world"]["is_available"] is True
    assert by_key["math"]["is_unlocked"] is True
    assert by_key["reading"]["is_unlocked"] is True
    assert by_key["writing"]["coming_soon"] is False
    assert by_key["science"]["coming_soon"] is False
    assert by_key["geography"]["coming_soon"] is True
    assert by_key["music"]["coming_soon"] is True
