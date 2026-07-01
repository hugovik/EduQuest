import pytest
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.database import Base
from app.models import AdventureLevelPreference
from app.repositories.child_repository import ChildRepository
from app.repositories.learning_preference_repository import LearningPreferenceRepository
from app.services.learning_preference_service import LearningPreferenceService


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
def learning_preference_service():
    return LearningPreferenceService(
        child_repository=ChildRepository(),
        learning_preference_repository=LearningPreferenceRepository(),
    )


def test_get_preference_returns_default_null_when_missing(
    db_session,
    learning_preference_service,
):
    preference = learning_preference_service.get_preference(db_session, "math")

    assert preference.adventure_type == "math"
    assert preference.override_level is None
    assert preference.child_id is not None


def test_update_preference_creates_preference(
    db_session,
    learning_preference_service,
):
    preference = learning_preference_service.update_preference(
        db_session,
        "math",
        3,
    )

    assert preference.adventure_type == "math"
    assert preference.override_level == 3
    assert db_session.query(AdventureLevelPreference).count() == 1


def test_update_preference_updates_existing_preference(
    db_session,
    learning_preference_service,
):
    first = learning_preference_service.update_preference(db_session, "math", 3)
    second = learning_preference_service.update_preference(db_session, "math", 4)

    assert second.id == first.id
    assert second.override_level == 4
    assert db_session.query(AdventureLevelPreference).count() == 1


def test_update_preference_resets_to_child_grade(
    db_session,
    learning_preference_service,
):
    learning_preference_service.update_preference(db_session, "math", 3)
    preference = learning_preference_service.update_preference(db_session, "math", None)

    assert preference.override_level is None
    assert db_session.query(AdventureLevelPreference).count() == 1


def test_invalid_adventure_type_is_rejected(
    db_session,
    learning_preference_service,
):
    with pytest.raises(HTTPException) as exc_info:
        learning_preference_service.get_preference(db_session, "invalid")

    assert exc_info.value.status_code == 400


def test_invalid_override_level_is_rejected(
    db_session,
    learning_preference_service,
):
    with pytest.raises(HTTPException) as exc_info:
        learning_preference_service.update_preference(db_session, "math", 6)

    assert exc_info.value.status_code == 422


def test_one_preference_per_child_and_adventure(
    db_session,
    learning_preference_service,
):
    learning_preference_service.update_preference(db_session, "math", 3)
    learning_preference_service.update_preference(db_session, "math", 2)
    learning_preference_service.update_preference(db_session, "reading", 4)

    assert db_session.query(AdventureLevelPreference).count() == 2
    assert (
        db_session.query(AdventureLevelPreference)
        .filter(AdventureLevelPreference.adventure_type == "math")
        .one()
        .override_level
        == 2
    )
