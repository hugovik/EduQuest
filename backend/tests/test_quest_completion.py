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


def seed_quest(db_session):
    quest = Quest(
        id="reading-forest-test",
        title="The Test Page",
        realm="Reading Forest",
        subject="reading",
        xp_reward=25,
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
    assert tree_event.growth_type == "new_leaf"
    assert achievement_unlock.achievement_id == "first-quest"


def test_complete_quest_returns_404_for_missing_quest(db_session, quest_service):
    with pytest.raises(HTTPException) as exc_info:
        quest_service.complete_quest(db_session, "missing-quest")

    assert exc_info.value.status_code == 404
