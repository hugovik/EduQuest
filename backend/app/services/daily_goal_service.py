from datetime import date, datetime, timedelta

from sqlalchemy.orm import Session

from app.models.daily_goal import DailyGoal
from app.models.learning_streak import LearningStreak
from app.repositories.child_repository import ChildRepository
from app.repositories.daily_goal_repository import DailyGoalRepository
from app.repositories.learning_streak_repository import LearningStreakRepository


class DailyGoalService:
    def __init__(
        self,
        child_repository: ChildRepository,
        daily_goal_repository: DailyGoalRepository,
        learning_streak_repository: LearningStreakRepository,
    ):
        self.child_repository = child_repository
        self.daily_goal_repository = daily_goal_repository
        self.learning_streak_repository = learning_streak_repository

    def today(self) -> date:
        return date.today()

    def get_child_or_create_default(self, db: Session):
        child = self.child_repository.get_first(db)

        if child is None:
            child = self.child_repository.create_default_child(db)

        return child

    def get_today_goal(self, db: Session) -> DailyGoal:
        child = self.get_child_or_create_default(db)
        goal = self.daily_goal_repository.get_or_create_today(db, child.id, self.today())
        db.commit()
        db.refresh(goal)
        return goal

    def get_streak(self, db: Session) -> LearningStreak:
        child = self.get_child_or_create_default(db)
        streak = self.learning_streak_repository.get_or_create(db, child.id)
        db.commit()
        db.refresh(streak)
        return streak

    def update_streak_for_completed_goal(
        self,
        streak: LearningStreak,
        completed_date: date,
    ) -> bool:
        if streak.last_completed_date == completed_date:
            return False

        if streak.last_completed_date == completed_date - timedelta(days=1):
            streak.current_streak_days += 1
        else:
            streak.current_streak_days = 1

        streak.longest_streak_days = max(
            streak.longest_streak_days,
            streak.current_streak_days,
        )
        streak.last_completed_date = completed_date
        return True

    def record_correct_answer(self, db: Session) -> dict:
        child = self.get_child_or_create_default(db)
        goal = self.daily_goal_repository.get_or_create_today(db, child.id, self.today())
        streak = self.learning_streak_repository.get_or_create(db, child.id)
        events = []
        completed_today = False

        if goal.completed:
            db.flush()
            return {
                "daily_goal": goal,
                "streak": streak,
                "completed_today": False,
                "events": events,
            }

        goal.current_correct_answers += 1
        events.append("Daily Goal Progress")

        if goal.current_correct_answers >= goal.target_correct_answers:
            goal.current_correct_answers = goal.target_correct_answers
            goal.completed = True
            goal.completed_at = datetime.utcnow()
            completed_today = self.update_streak_for_completed_goal(streak, goal.date)
            events.append("Daily Goal Complete")

            if completed_today:
                events.append("Learning Streak Updated")

        db.flush()

        return {
            "daily_goal": goal,
            "streak": streak,
            "completed_today": completed_today,
            "events": events,
        }
