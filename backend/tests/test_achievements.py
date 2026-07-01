import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.database import Base
from app.models import AchievementUnlock
from app.repositories.achievement_repository import AchievementRepository
from app.repositories.child_repository import ChildRepository
from app.repositories.daily_goal_repository import DailyGoalRepository
from app.repositories.inventory_repository import InventoryRepository
from app.repositories.learning_streak_repository import LearningStreakRepository
from app.repositories.obstacle_progress_repository import ObstacleProgressRepository
from app.services.achievement_service import AchievementService
from app.services.daily_goal_service import DailyGoalService
from app.services.reward_service import RewardService


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
def achievement_service():
    return AchievementService(
        child_repository=ChildRepository(),
        achievement_repository=AchievementRepository(),
    )


def make_daily_goal_service():
    return DailyGoalService(
        child_repository=ChildRepository(),
        daily_goal_repository=DailyGoalRepository(),
        learning_streak_repository=LearningStreakRepository(),
    )


def make_reward_service(achievement_service, daily_goal_service=None):
    return RewardService(
        child_repository=ChildRepository(),
        inventory_repository=InventoryRepository(),
        obstacle_progress_repository=ObstacleProgressRepository(),
        daily_goal_service=daily_goal_service,
        achievement_service=achievement_service,
    )


def test_achievement_awarded_once_only(db_session, achievement_service):
    child = achievement_service.get_child_or_create_default(db_session)

    first = achievement_service.evaluate(
        db_session,
        "adventure_entered",
        child=child,
        source_adventure="math",
    )
    second = achievement_service.evaluate(
        db_session,
        "adventure_entered",
        child=child,
        source_adventure="math",
    )
    db_session.commit()

    assert [achievement.id for achievement in first] == ["first_adventure_entered"]
    assert second == []
    assert db_session.query(AchievementUnlock).count() == 1


def test_correct_math_answer_unlocks_first_math_badge(db_session, achievement_service):
    reward_service = make_reward_service(achievement_service)

    result = reward_service.reward_correct_answer(db_session, "broken-bridge-001")

    assert [achievement.id for achievement in result["achievements_unlocked"]] == [
        "first_math_answer"
    ]


def test_obstacle_completion_unlocks_obstacle_badges(db_session, achievement_service):
    reward_service = make_reward_service(achievement_service)
    result = None

    for _ in range(20):
        result = reward_service.reward_correct_answer(db_session, "broken-bridge-001")

    unlocked_ids = {achievement.id for achievement in result["achievements_unlocked"]}

    assert "first_obstacle_completed" in unlocked_ids
    assert "first_bridge_repaired" in unlocked_ids


def test_daily_goal_completion_unlocks_daily_badge(db_session, achievement_service):
    daily_goal_service = make_daily_goal_service()
    reward_service = make_reward_service(achievement_service, daily_goal_service)
    goal = daily_goal_service.get_today_goal(db_session)
    goal.target_correct_answers = 1
    db_session.commit()

    result = reward_service.reward_correct_answer(db_session, "broken-bridge-001")
    unlocked_ids = {achievement.id for achievement in result["achievements_unlocked"]}

    assert "first_daily_goal" in unlocked_ids


def test_streak_achievement_unlocks_at_three_days(db_session, achievement_service):
    child = achievement_service.get_child_or_create_default(db_session)
    streak = make_daily_goal_service().get_streak(db_session)
    streak.current_streak_days = 3
    db_session.commit()

    result = achievement_service.evaluate(
        db_session,
        "streak_updated",
        child=child,
        source_adventure="math",
        streak=streak,
    )

    assert [achievement.id for achievement in result] == ["three_day_streak"]


def test_xp_bonus_applied_once_only(db_session, achievement_service):
    child = achievement_service.get_child_or_create_default(db_session)
    achievement_service.seed_achievements(db_session)
    achievement = achievement_service.achievement_repository.get_by_id(
        db_session,
        "first_adventure_entered",
    )
    achievement.xp_bonus = 5
    db_session.commit()

    achievement_service.evaluate(
        db_session,
        "adventure_entered",
        child=child,
        source_adventure="math",
    )
    achievement_service.evaluate(
        db_session,
        "adventure_entered",
        child=child,
        source_adventure="math",
    )
    db_session.commit()
    db_session.refresh(child)

    assert child.xp == 5
    assert db_session.query(AchievementUnlock).count() == 1
