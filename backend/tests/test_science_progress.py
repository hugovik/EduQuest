import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.database import Base
from app.models.child import Child
from app.models.progress_event import ProgressEvent
from app.models.science_progress import ScienceProgress
from app.models.tree_growth_event import TreeGrowthEvent
from app.repositories.child_repository import ChildRepository
from app.services.adventure_progress_summary_service import AdventureProgressSummaryService
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
    return ScienceService(child_repository=ChildRepository())


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


def test_science_progress_persists_completed_experiments(db_session, science_service):
    science_service.complete_experiment(db_session, "electricity-1")
    science_service.complete_experiment(db_session, "electricity-2")

    progress = science_service.get_progress(db_session)

    assert progress["completed_experiments"] == ["electricity-1", "electricity-2"]
    assert progress["experiments_completed"] == 2
    assert progress["xp_earned"] == 25


def test_adventure_summary_includes_science_xp_and_completion(db_session, science_service):
    summary_service = AdventureProgressSummaryService(child_repository=ChildRepository())
    science_service.complete_experiment(db_session, "electricity-1")

    summary = summary_service.get_summary(db_session)

    assert summary["science"]["completed_quests"] == 1
    assert summary["science"]["total_quests"] >= 1
    assert summary["science"]["xp_earned"] == 10
    assert summary["science"]["status"] == "in_progress"
