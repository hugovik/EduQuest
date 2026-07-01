import pytest
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.api.quest_routes import seed_first_quest
from app.database.database import Base
from app.models import Quest, QuestCompletion
from app.repositories.achievement_repository import AchievementRepository
from app.repositories.child_repository import ChildRepository
from app.repositories.progress_event_repository import ProgressEventRepository
from app.repositories.quest_completion_repository import QuestCompletionRepository
from app.repositories.quest_repository import QuestRepository
from app.repositories.tree_growth_event_repository import TreeGrowthEventRepository
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
def quest_service():
    return QuestService(
        child_repository=ChildRepository(),
        quest_repository=QuestRepository(),
        quest_completion_repository=QuestCompletionRepository(),
        progress_event_repository=ProgressEventRepository(),
        tree_growth_event_repository=TreeGrowthEventRepository(),
        achievement_repository=AchievementRepository(),
    )


def test_seed_first_quest_includes_math_quest(db_session, quest_service):
    seed_first_quest(db_session, quest_service)

    math_quest = db_session.query(Quest).filter(Quest.id == "math-mountains-001").one()

    assert math_quest.title == "The First Number Bridge"
    assert math_quest.realm == "Math Mountains"
    assert math_quest.subject == "math"
    assert math_quest.question == "What is 8 + 5?"
    assert math_quest.answer == "13"
    assert math_quest.xp_reward == 25
    assert math_quest.repeatable is False


def test_math_quest_can_be_completed_and_awards_25_xp(db_session, quest_service):
    seed_first_quest(db_session, quest_service)

    result = quest_service.complete_quest(db_session, "math-mountains-001")

    completion = db_session.query(QuestCompletion).one()

    assert result["reward"]["xp"] == 25
    assert completion.quest_id == "math-mountains-001"
    assert completion.xp_awarded == 25
    assert result["child"].xp == 65


def test_duplicate_non_repeatable_math_quest_completion_is_blocked(db_session, quest_service):
    seed_first_quest(db_session, quest_service)
    first_result = quest_service.complete_quest(db_session, "math-mountains-001")
    child = first_result["child"]
    xp_after_first_completion = child.xp

    with pytest.raises(HTTPException) as exc_info:
        quest_service.complete_quest(db_session, "math-mountains-001")

    db_session.refresh(child)

    assert exc_info.value.status_code == 409
    assert child.xp == xp_after_first_completion
    assert db_session.query(QuestCompletion).count() == 1
