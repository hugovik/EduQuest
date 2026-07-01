from sqlalchemy.orm import Session

from app.models.achievement import Achievement
from app.models.achievement_unlock import AchievementUnlock


class AchievementRepository:
    def get_by_id(self, db: Session, achievement_id: str) -> Achievement | None:
        return db.query(Achievement).filter(Achievement.id == achievement_id).first()

    def list_all(self, db: Session) -> list[Achievement]:
        return db.query(Achievement).all()

    def create(self, db: Session, achievement: Achievement) -> Achievement:
        db.add(achievement)
        return achievement

    def get_unlock(
        self,
        db: Session,
        child_id: int,
        achievement_id: str,
    ) -> AchievementUnlock | None:
        return (
            db.query(AchievementUnlock)
            .filter(
                AchievementUnlock.child_id == child_id,
                AchievementUnlock.achievement_id == achievement_id,
            )
            .first()
        )

    def create_unlock(
        self,
        db: Session,
        child_id: int,
        achievement_id: str,
        source_adventure: str | None = None,
        metadata: str | None = None,
    ) -> AchievementUnlock:
        unlock = AchievementUnlock(
            child_id=child_id,
            achievement_id=achievement_id,
            source_adventure=source_adventure,
            metadata_json=metadata,
        )
        db.add(unlock)
        return unlock

    def list_unlocks_with_achievements(self, db: Session, child_id: int):
        return (
            db.query(AchievementUnlock, Achievement)
            .join(Achievement, AchievementUnlock.achievement_id == Achievement.id)
            .filter(AchievementUnlock.child_id == child_id)
            .order_by(AchievementUnlock.unlocked_at.desc())
            .all()
        )
