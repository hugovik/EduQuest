import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.database import Base
from app.models.child import Child
from app.models.progress_event import ProgressEvent
from app.models.tree_growth_event import TreeGrowthEvent
from app.models.writing_progress import WritingProgress
from app.repositories.child_repository import ChildRepository
from app.services.adventure_completion_service import AdventureCompletionService
from app.services.adventure_progress_summary_service import AdventureProgressSummaryService
from app.services.writing_service import WritingService


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
def writing_service():
    return WritingService(
        child_repository=ChildRepository(),
        completion_service=AdventureCompletionService(),
    )


def test_writing_completion_awards_xp_once(db_session, writing_service):
    starting_xp = writing_service.get_child_or_create_default(db_session).xp
    result = writing_service.complete_lesson(db_session, "missing-period-1")
    child = db_session.query(Child).one()

    assert result["xp_awarded"] == 5
    assert result["already_completed"] is False
    assert child.xp == starting_xp + 5
    assert db_session.query(WritingProgress).count() == 1
    assert db_session.query(ProgressEvent).count() == 1
    assert db_session.query(TreeGrowthEvent).count() == 1

    replay = writing_service.complete_lesson(db_session, "missing-period-1")
    db_session.refresh(child)

    assert replay["xp_awarded"] == 0
    assert replay["already_completed"] is True
    assert child.xp == starting_xp + 5
    assert db_session.query(WritingProgress).count() == 1
    assert db_session.query(ProgressEvent).count() == 1
    assert db_session.query(TreeGrowthEvent).count() == 1


def test_writing_progress_persists_completed_lessons(db_session, writing_service):
    writing_service.complete_lesson(db_session, "missing-period-1")
    writing_service.complete_lesson(db_session, "missing-question-1")

    progress = writing_service.get_progress(db_session)

    assert progress["completed_lessons"] == ["missing-period-1", "missing-question-1"]
    assert progress["lessons_completed"] == 2
    assert progress["xp_earned"] == 10


def test_adventure_summary_includes_writing_xp_and_completion(db_session, writing_service):
    summary_service = AdventureProgressSummaryService(child_repository=ChildRepository())
    writing_service.complete_lesson(db_session, "missing-period-1")

    summary = summary_service.get_summary(db_session)

    assert summary["writing"]["completed_quests"] == 1
    assert summary["writing"]["total_quests"] >= 1
    assert summary["writing"]["xp_earned"] == 5
    assert summary["writing"]["status"] == "in_progress"
