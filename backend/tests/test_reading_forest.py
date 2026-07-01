import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.database import Base
from app.repositories.achievement_repository import AchievementRepository
from app.repositories.child_repository import ChildRepository
from app.repositories.daily_goal_repository import DailyGoalRepository
from app.repositories.learning_streak_repository import LearningStreakRepository
from app.repositories.reading_repository import ReadingPassageRepository, ReadingProgressRepository
from app.services.achievement_service import AchievementService
from app.services.adventure_progress_summary_service import AdventureProgressSummaryService
from app.services.daily_goal_service import DailyGoalService
from app.services.reading_service import READING_CORRECT_ANSWER_XP, ReadingService


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
def reading_service():
    child_repository = ChildRepository()
    daily_goal_service = DailyGoalService(
        child_repository=child_repository,
        daily_goal_repository=DailyGoalRepository(),
        learning_streak_repository=LearningStreakRepository(),
    )
    achievement_service = AchievementService(
        child_repository=child_repository,
        achievement_repository=AchievementRepository(),
    )
    return ReadingService(
        child_repository=child_repository,
        passage_repository=ReadingPassageRepository(),
        progress_repository=ReadingProgressRepository(),
        daily_goal_service=daily_goal_service,
        achievement_service=achievement_service,
    )


def correct_answers_for(passage_data):
    answers = {}
    for question in passage_data["questions"]:
        if question["type"] == "sequence":
            answers[question["id"]] = question["items"]
        elif question["type"] == "true_false":
            answers[question["id"]] = "True"
        else:
            answers[question["id"]] = question["options"][0]
    return answers


def test_level_selection_loads_ten_grade_one_passages(db_session, reading_service):
    passages = reading_service.list_passages(db_session, 1)

    assert len(passages) == 10
    assert all(passage["level"] == 1 for passage in passages)


def test_passage_loading_hides_answers(db_session, reading_service):
    passage = reading_service.list_passages(db_session, 2)[0]

    assert passage["questions"]
    assert "answer" not in passage["questions"][0]


def test_comprehension_scoring_rewards_and_persists_progress(db_session, reading_service):
    child = reading_service.get_child_or_create_default(db_session)
    starting_xp = child.xp
    passage = reading_service.list_passages(db_session, 2)[0]

    result = reading_service.submit_answers(
        db_session,
        passage["id"],
        correct_answers_for(passage),
    )

    assert result["score"] == 4
    assert result["total_questions"] == 4
    assert result["rewards"]["xp"] == 4 * READING_CORRECT_ANSWER_XP
    assert result["child"].xp == starting_xp + result["rewards"]["xp"]
    assert result["progress"]["completed"] is True
    assert result["progress"]["questions_answered"] == 4
    assert result["progress"]["correct_answers"] == 4
    assert result["progress"]["vocabulary_learned"] == 2
    assert result["progress"]["accuracy"] == 1


def test_duplicate_passage_completion_does_not_award_extra_xp(db_session, reading_service):
    child = reading_service.get_child_or_create_default(db_session)
    passage = reading_service.list_passages(db_session, 2)[0]
    reading_service.submit_answers(db_session, passage["id"], correct_answers_for(passage))
    xp_after_first = child.xp

    duplicate = reading_service.submit_answers(
        db_session,
        passage["id"],
        correct_answers_for(passage),
    )
    db_session.refresh(child)

    assert duplicate["duplicate"] is True
    assert duplicate["rewards"]["xp"] == 0
    assert child.xp == xp_after_first


def test_daily_goal_and_achievement_integration(db_session, reading_service):
    goal = reading_service.daily_goal_service.get_today_goal(db_session)
    goal.target_correct_answers = 1
    db_session.commit()
    passage = reading_service.list_passages(db_session, 1)[0]

    result = reading_service.submit_answers(
        db_session,
        passage["id"],
        {"q1": "Beside the old tree"},
    )
    unlocked_ids = {achievement.id for achievement in result["achievements_unlocked"]}

    assert result["daily_goal"].completed is True
    assert "first_daily_goal" in unlocked_ids


def test_adventure_summary_uses_reading_progress(db_session, reading_service):
    passage = reading_service.list_passages(db_session, 3)[0]
    reading_service.submit_answers(db_session, passage["id"], correct_answers_for(passage))
    summary_service = AdventureProgressSummaryService(child_repository=ChildRepository())

    summary = summary_service.get_summary(db_session)

    assert summary["reading"]["completed_quests"] == 1
    assert summary["reading"]["total_quests"] >= 30
    assert summary["reading"]["xp_earned"] == 4 * READING_CORRECT_ANSWER_XP
    assert summary["reading"]["status"] == "in_progress"


def test_progress_summary_exposes_parent_friendly_reading_metrics(db_session, reading_service):
    passage = reading_service.list_passages(db_session, 2)[0]
    reading_service.submit_answers(db_session, passage["id"], correct_answers_for(passage))

    summary = reading_service.get_progress_summary(db_session)

    assert summary["completed_passage_ids"] == [passage["id"]]
    assert summary["passages_completed"] == 1
    assert summary["questions_answered"] == 4
    assert summary["correct_answers"] == 4
    assert summary["accuracy"] == 1
    assert summary["total_xp_earned"] == 4 * READING_CORRECT_ANSWER_XP
    assert summary["vocabulary_learned"] == 2
    assert summary["vocabulary_words"]
