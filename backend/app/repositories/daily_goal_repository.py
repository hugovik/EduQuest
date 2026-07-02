from datetime import date

from sqlalchemy.orm import Session

from app.models.daily_goal import DailyGoal

DEFAULT_DAILY_GOAL_TARGET = 10


class DailyGoalRepository:
    def get_by_child_and_date(
        self,
        db: Session,
        child_id: int,
        goal_date: date,
    ) -> DailyGoal | None:
        return (
            db.query(DailyGoal)
            .filter(
                DailyGoal.child_id == child_id,
                DailyGoal.date == goal_date,
            )
            .first()
        )

    def get_or_create_today(
        self,
        db: Session,
        child_id: int,
        goal_date: date,
    ) -> DailyGoal:
        goal = self.get_by_child_and_date(db, child_id, goal_date)

        if goal is None:
            goal = DailyGoal(
                child_id=child_id,
                date=goal_date,
                target_correct_answers=DEFAULT_DAILY_GOAL_TARGET,
                current_correct_answers=0,
                completed=False,
            )
            db.add(goal)
            db.flush()

        return goal
