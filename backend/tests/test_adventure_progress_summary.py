import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.database import Base
from app.models import Quest, QuestCompletion
from app.repositories.child_repository import ChildRepository
from app.services.adventure_progress_summary_service import (
    ADVENTURE_TYPES,
    AdventureProgressSummaryService,
)
from app.services.reading_service import READING_PASSAGES


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
def summary_service():
    return AdventureProgressSummaryService(child_repository=ChildRepository())


def seed_math_quest(db_session, quest_id="math-test", xp_reward=25):
    quest = Quest(
        id=quest_id,
        title="Math Test",
        realm="Math Mountains",
        subject="math",
        xp_reward=xp_reward,
        repeatable=False,
    )
    db_session.add(quest)
    db_session.commit()
    return quest


def seed_reading_quest(db_session, quest_id="reading-test", xp_reward=25):
    quest = Quest(
        id=quest_id,
        title="Reading Test",
        realm="Reading Forest",
        subject="reading",
        xp_reward=xp_reward,
        repeatable=False,
    )
    db_session.add(quest)
    db_session.commit()
    return quest


def test_summary_returns_all_adventure_keys(db_session, summary_service):
    summary = summary_service.get_summary(db_session)

    assert set(summary.keys()) == set(ADVENTURE_TYPES)


def test_math_uses_real_completed_quest_data(db_session, summary_service):
    child = summary_service.get_child_or_create_default(db_session)
    quest = seed_math_quest(db_session, xp_reward=30)
    db_session.add(
        QuestCompletion(
            child_id=child.id,
            quest_id=quest.id,
            xp_awarded=30,
        )
    )
    db_session.commit()

    summary = summary_service.get_summary(db_session)

    assert summary["math"]["completed_quests"] == 1
    assert summary["math"]["total_quests"] == 1
    assert summary["math"]["xp_earned"] == 30
    assert summary["math"]["status"] == "completed"


def test_reading_uses_real_completed_quest_data(db_session, summary_service):
    child = summary_service.get_child_or_create_default(db_session)
    quest = seed_reading_quest(db_session, xp_reward=20)
    db_session.add(
        QuestCompletion(
            child_id=child.id,
            quest_id=quest.id,
            xp_awarded=20,
        )
    )
    db_session.commit()

    summary = summary_service.get_summary(db_session)
    current_level_passages = len([
        passage for passage in READING_PASSAGES if passage["level"] == child.grade
    ])

    assert summary["reading"]["completed_quests"] == 1
    assert summary["reading"]["total_quests"] == current_level_passages + 1
    assert summary["reading"]["xp_earned"] == 20
    assert summary["reading"]["status"] == "in_progress"


def test_missing_adventure_data_returns_defaults(db_session, summary_service):
    summary = summary_service.get_summary(db_session)
    child = summary_service.get_child_or_create_default(db_session)
    current_level_passages = len([
        passage for passage in READING_PASSAGES if passage["level"] == child.grade
    ])

    assert summary["reading"]["completed_quests"] == 0
    assert summary["reading"]["total_quests"] == current_level_passages
    assert summary["reading"]["xp_earned"] == 0
    assert summary["reading"]["status"] == "not_started"


def test_status_is_in_progress_when_some_math_quests_are_complete(
    db_session,
    summary_service,
):
    child = summary_service.get_child_or_create_default(db_session)
    completed_quest = seed_math_quest(db_session, "math-complete")
    seed_math_quest(db_session, "math-open")
    db_session.add(
        QuestCompletion(
            child_id=child.id,
            quest_id=completed_quest.id,
            xp_awarded=25,
        )
    )
    db_session.commit()

    summary = summary_service.get_summary(db_session)

    assert summary["math"]["completed_quests"] == 1
    assert summary["math"]["total_quests"] == 2
    assert summary["math"]["status"] == "in_progress"


def test_summary_uses_current_child_level(db_session, summary_service):
    child = summary_service.get_child_or_create_default(db_session)
    child.level = 3
    db_session.commit()

    summary = summary_service.get_summary(db_session)

    assert summary["math"]["level"] == 3
    assert summary["science"]["level"] == 3
