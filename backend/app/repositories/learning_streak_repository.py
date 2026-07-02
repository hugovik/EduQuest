from sqlalchemy.orm import Session

from app.models.learning_streak import LearningStreak


class LearningStreakRepository:
    def get_by_child(self, db: Session, child_id: int) -> LearningStreak | None:
        return db.query(LearningStreak).filter(LearningStreak.child_id == child_id).first()

    def get_or_create(self, db: Session, child_id: int) -> LearningStreak:
        streak = self.get_by_child(db, child_id)

        if streak is None:
            streak = LearningStreak(
                child_id=child_id,
                current_streak_days=0,
                longest_streak_days=0,
                last_completed_date=None,
            )
            db.add(streak)
            db.flush()

        return streak
