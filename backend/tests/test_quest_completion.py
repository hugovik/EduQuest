import pytest
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.database import Base
from app.models import AchievementUnlock, ProgressEvent, Quest, QuestCompletion, TreeGrowthEvent
from app.repositories.child_repository import ChildRepository
from app.repositories.quest_repository import QuestRepository
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
    )


def seed_quest(db_session, repeatable=False):
    quest = Quest(
        id="reading-forest-test",
        title="The Test Page",
        realm="Reading Forest",
        subject="reading",
        xp_reward=25,
        repeatable=repeatable,
    )
    db_session.add(quest)
    db_session.commit()
    return quest


def test_complete_quest_persists_completion_events_and_first_achievement(db_session, quest_service):
    quest = seed_quest(db_session)

    result = quest_service.complete_quest(db_session, quest.id)

    completion = db_session.query(QuestCompletion).one()
    progress_event = db_session.query(ProgressEvent).one()
    tree_event = db_session.query(TreeGrowthEvent).one()
    achievement_unlock = db_session.query(AchievementUnlock).one()

    assert result["quest_completion_id"] == completion.id
    assert completion.quest_id == quest.id
    assert completion.xp_awarded == quest.xp_reward
    assert progress_event.event_type == "quest_completed"
    assert progress_event.xp_change == quest.xp_reward
    assert progress_event.quest_completion_id == completion.id
    assert tree_event.growth_type == "new_leaf"
    assert tree_event.quest_completion_id == completion.id
    assert achievement_unlock.achievement_id == "first-quest"


def test_complete_quest_returns_404_for_missing_quest(db_session, quest_service):
    with pytest.raises(HTTPException) as exc_info:
        quest_service.complete_quest(db_session, "missing-quest")

    assert exc_info.value.status_code == 404


def test_complete_quest_blocks_duplicate_non_repeatable_quest(db_session, quest_service):
    quest = seed_quest(db_session)

    first_result = quest_service.complete_quest(db_session, quest.id)
    child = first_result["child"]
    xp_after_first_completion = child.xp

    with pytest.raises(HTTPException) as exc_info:
        quest_service.complete_quest(db_session, quest.id)

    db_session.refresh(child)

    assert exc_info.value.status_code == 409
    assert child.xp == xp_after_first_completion
    assert db_session.query(QuestCompletion).count() == 1
    assert db_session.query(ProgressEvent).count() == 1
    assert db_session.query(TreeGrowthEvent).count() == 1
    assert db_session.query(AchievementUnlock).count() == 1


def test_complete_quest_allows_duplicate_repeatable_quest(db_session, quest_service):
    quest = seed_quest(db_session, repeatable=True)

    first_result = quest_service.complete_quest(db_session, quest.id)
    xp_after_first_completion = first_result["child"].xp
    second_result = quest_service.complete_quest(db_session, quest.id)

    assert second_result["child"].xp == xp_after_first_completion + quest.xp_reward
    assert db_session.query(QuestCompletion).count() == 2
    assert db_session.query(ProgressEvent).count() == 2
    assert db_session.query(TreeGrowthEvent).count() == 2
    assert db_session.query(AchievementUnlock).count() == 1


def test_repeatable_quest_events_reference_their_own_completions(db_session, quest_service):
    quest = seed_quest(db_session, repeatable=True)

    quest_service.complete_quest(db_session, quest.id)
    quest_service.complete_quest(db_session, quest.id)

    completions = db_session.query(QuestCompletion).order_by(QuestCompletion.id).all()
    progress_events = db_session.query(ProgressEvent).order_by(ProgressEvent.id).all()
    tree_events = db_session.query(TreeGrowthEvent).order_by(TreeGrowthEvent.id).all()

    assert [event.quest_completion_id for event in progress_events] == [
        completion.id for completion in completions
    ]
    assert [event.quest_completion_id for event in tree_events] == [
        completion.id for completion in completions
    ]
