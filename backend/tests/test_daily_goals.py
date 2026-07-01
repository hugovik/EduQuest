from datetime import date, timedelta

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.database import Base
from app.repositories.child_repository import ChildRepository
from app.repositories.daily_goal_repository import DailyGoalRepository
from app.repositories.inventory_repository import InventoryRepository
from app.repositories.learning_streak_repository import LearningStreakRepository
from app.repositories.obstacle_progress_repository import ObstacleProgressRepository
from app.services.daily_goal_service import DailyGoalService
from app.services.reward_service import RewardService


class FixedDateDailyGoalService(DailyGoalService):
    def __init__(self, current_date, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.current_date = current_date

    def today(self):
        return self.current_date


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


def make_daily_goal_service(goal_date=None):
    service_class = DailyGoalService
    args = {}

    if goal_date is not None:
        service_class = FixedDateDailyGoalService
        args["current_date"] = goal_date

    return service_class(
        child_repository=ChildRepository(),
        daily_goal_repository=DailyGoalRepository(),
        learning_streak_repository=LearningStreakRepository(),
        **args,
    )


def make_reward_service(daily_goal_service=None):
    return RewardService(
        child_repository=ChildRepository(),
        inventory_repository=InventoryRepository(),
        obstacle_progress_repository=ObstacleProgressRepository(),
        daily_goal_service=daily_goal_service,
    )


def test_creates_todays_goal_if_missing(db_session):
    service = make_daily_goal_service()

    goal = service.get_today_goal(db_session)

    assert goal.target_correct_answers == 10
    assert goal.current_correct_answers == 0
    assert goal.completed is False


def test_correct_answer_increments_goal(db_session):
    service = make_daily_goal_service()

    result = service.record_correct_answer(db_session)
    db_session.commit()

    assert result["daily_goal"].current_correct_answers == 1
    assert result["daily_goal"].completed is False


def test_incorrect_answer_does_not_increment_goal(db_session):
    daily_goal_service = make_daily_goal_service()
    reward_service = make_reward_service(daily_goal_service)
    goal = daily_goal_service.get_today_goal(db_session)

    reward_service.award_incorrect_answer(db_session, "broken-bridge-001")
    db_session.refresh(goal)

    assert goal.current_correct_answers == 0
    assert goal.completed is False


def test_goal_completes_at_target(db_session):
    service = make_daily_goal_service()
    goal = service.get_today_goal(db_session)
    goal.target_correct_answers = 2
    goal.current_correct_answers = 1
    db_session.commit()

    result = service.record_correct_answer(db_session)
    db_session.commit()

    assert result["daily_goal"].completed is True
    assert result["daily_goal"].current_correct_answers == 2
    assert result["daily_goal"].completed_at is not None


def test_streak_increments_once_per_day(db_session):
    service = make_daily_goal_service()
    goal = service.get_today_goal(db_session)
    goal.target_correct_answers = 1
    db_session.commit()

    first = service.record_correct_answer(db_session)
    second = service.record_correct_answer(db_session)
    db_session.commit()

    assert first["streak"].current_streak_days == 1
    assert second["streak"].current_streak_days == 1
    assert second["completed_today"] is False


def test_missed_day_resets_current_streak(db_session):
    today = date(2026, 7, 1)
    service = make_daily_goal_service(today)
    streak = service.get_streak(db_session)
    streak.current_streak_days = 5
    streak.longest_streak_days = 5
    streak.last_completed_date = today - timedelta(days=2)
    goal = service.get_today_goal(db_session)
    goal.target_correct_answers = 1
    db_session.commit()

    result = service.record_correct_answer(db_session)
    db_session.commit()

    assert result["streak"].current_streak_days == 1
    assert result["streak"].longest_streak_days == 5


def test_longest_streak_is_preserved_and_can_increase(db_session):
    today = date(2026, 7, 1)
    service = make_daily_goal_service(today)
    streak = service.get_streak(db_session)
    streak.current_streak_days = 2
    streak.longest_streak_days = 2
    streak.last_completed_date = today - timedelta(days=1)
    goal = service.get_today_goal(db_session)
    goal.target_correct_answers = 1
    db_session.commit()

    result = service.record_correct_answer(db_session)
    db_session.commit()

    assert result["streak"].current_streak_days == 3
    assert result["streak"].longest_streak_days == 3


def test_correct_math_reward_updates_daily_goal(db_session):
    daily_goal_service = make_daily_goal_service()
    reward_service = make_reward_service(daily_goal_service)

    result = reward_service.reward_correct_answer(db_session, "broken-bridge-001")

    assert result["daily_goal"].current_correct_answers == 1
    assert result["streak"].current_streak_days == 0



def test_correct_answer_updates_daily_goal_after_obstacle_completed(db_session):
    daily_goal_service = make_daily_goal_service()
    reward_service = make_reward_service(daily_goal_service)
    reward_service.reward_correct_answer(db_session, "broken-bridge-001")

    progress = reward_service.obstacle_progress_repository.get_or_create(
        db_session,
        1,
        "broken-bridge-001",
        reward_service.get_required_progress("broken-bridge-001"),
    )
    progress.current_progress = progress.required_progress
    progress.completed = True
    db_session.commit()

    result = reward_service.reward_correct_answer(db_session, "broken-bridge-001")

    assert result["daily_goal"].current_correct_answers == 2
