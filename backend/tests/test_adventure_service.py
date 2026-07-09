from datetime import datetime

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.database import Base
from app.models.quest import Quest
from app.models.quest_completion import QuestCompletion
from app.models.reading_progress import ReadingProgress
from app.repositories.child_repository import ChildRepository
from app.services.adventure_progress_summary_service import AdventureProgressSummaryService
from app.services.adventure_service import AdventureService
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
def adventure_service():
    progress_summary_service = AdventureProgressSummaryService(
        child_repository=ChildRepository(),
    )
    return AdventureService(
        progress_summary_service=progress_summary_service,
        adventure_unlock_service=AdventureUnlockService(
            child_repository=ChildRepository(),
            progress_summary_service=progress_summary_service,
        ),
    )


def test_adventures_return_shared_registry_metadata(db_session, adventure_service):
    adventures = adventure_service.get_adventures(db_session)
    adventure_ids = {adventure["id"] for adventure in adventures}

    assert "tree-house" in adventure_ids
    assert "math-mountains" in adventure_ids
    assert "reading-forest" in adventure_ids
    assert "writing-kingdom" in adventure_ids
    assert adventure_service.get_adventure(db_session, "math-mountains")["is_playable"] is True
    assert adventure_service.get_adventure(db_session, "writing-kingdom")["is_playable"] is True


def test_math_progress_maps_existing_quest_completion(db_session, adventure_service):
    child = adventure_service.progress_summary_service.get_child_or_create_default(db_session)
    quest = Quest(
        id="math-adventure-test",
        title="Math Adventure Test",
        realm="Math Mountains",
        subject="math",
        xp_reward=25,
        repeatable=False,
    )
    db_session.add(quest)
    db_session.add(
        QuestCompletion(
            child_id=child.id,
            quest_id=quest.id,
            xp_awarded=25,
            completed_at=datetime(2026, 1, 1),
        )
    )
    db_session.commit()

    progress = adventure_service.get_adventure_progress(db_session, "math-mountains")

    assert progress["activities_completed"] == 1
    assert progress["correct_answers"] == 1
    assert progress["incorrect_answers"] == 0
    assert progress["xp_earned"] == 25
    assert progress["completion_percent"] == 100
    assert progress["last_activity"] == datetime(2026, 1, 1)


def test_reading_progress_maps_existing_reading_progress(db_session, adventure_service):
    child = adventure_service.progress_summary_service.get_child_or_create_default(db_session)
    db_session.add(
        ReadingProgress(
            child_id=child.id,
            passage_id="reading-level-2-test",
            level=child.grade,
            questions_answered=4,
            correct_answers=3,
            vocabulary_learned=2,
            xp_awarded=15,
            completed=True,
            completed_at=datetime(2026, 1, 2),
            updated_at=datetime(2026, 1, 3),
        )
    )
    db_session.commit()

    progress = adventure_service.get_adventure_progress(db_session, "reading-forest")

    assert progress["activities_completed"] == 1
    assert progress["correct_answers"] == 3
    assert progress["incorrect_answers"] == 1
    assert progress["xp_earned"] == 15
    assert progress["last_activity"] == datetime(2026, 1, 3)


def test_future_adventure_progress_returns_safe_defaults(db_session, adventure_service):
    progress = adventure_service.get_adventure_progress(db_session, "geography-island")

    assert progress["activities_completed"] == 0
    assert progress["correct_answers"] == 0
    assert progress["incorrect_answers"] == 0
    assert progress["xp_earned"] == 0
    assert progress["completion_percent"] == 0
    assert progress["is_unlocked"] is False
