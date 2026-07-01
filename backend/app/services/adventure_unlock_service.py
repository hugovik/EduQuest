from sqlalchemy.orm import Session

from app.models.achievement_unlock import AchievementUnlock
from app.repositories.child_repository import ChildRepository
from app.services.adventure_progress_summary_service import (
    ADVENTURE_TYPES,
    AdventureProgressSummaryService,
)

ADVENTURE_UNLOCK_RULES = {
    "math": {"type": "default", "reason": "Unlocked by default"},
    "reading": {"type": "default", "reason": "Unlocked by default"},
    "writing": {"type": "default", "reason": "Unlocked by default"},
    "story": {
        "type": "completed_quests",
        "adventure": "reading",
        "required": 3,
        "reason": "Complete 3 Reading Forest quests to unlock Story Cave",
    },
    "geography": {
        "type": "completed_quests",
        "adventure": "math",
        "required": 2,
        "reason": "Complete 2 Math Mountains quests to unlock Geography Trail",
    },
    "science": {
        "type": "total_xp",
        "required": 100,
        "reason": "Earn 100 XP to unlock Science Lab",
    },
    "music": {
        "type": "achievement_or_xp",
        "required_xp": 150,
        "required_achievements": 1,
        "reason": "Unlock your first achievement or earn 150 XP to open Music Meadow",
    },
}


class AdventureUnlockService:
    def __init__(
        self,
        child_repository: ChildRepository,
        progress_summary_service: AdventureProgressSummaryService,
    ):
        self.child_repository = child_repository
        self.progress_summary_service = progress_summary_service

    def get_child_or_create_default(self, db: Session):
        child = self.child_repository.get_first(db)

        if child is None:
            child = self.child_repository.create_default_child(db)

        return child

    def get_total_xp(self, progress_summary: dict) -> int:
        return sum(
            adventure.get("xp_earned", 0)
            for adventure in progress_summary.values()
            if isinstance(adventure, dict)
        )

    def get_achievement_count(self, db: Session, child_id: int) -> int:
        return db.query(AchievementUnlock).filter(
            AchievementUnlock.child_id == child_id,
        ).count()

    def unlocked(self, reason: str, current: int | None = None, required: int | None = None) -> dict:
        return {
            "unlocked": True,
            "reason": reason,
            "current": current,
            "required": required,
        }

    def locked(self, reason: str, current: int, required: int) -> dict:
        return {
            "unlocked": False,
            "reason": reason,
            "current": current,
            "required": required,
        }

    def evaluate_rule(
        self,
        db: Session,
        child_id: int,
        progress_summary: dict,
        adventure_type: str,
    ) -> dict:
        rule = ADVENTURE_UNLOCK_RULES.get(adventure_type)

        if rule is None:
            return self.locked("Keep exploring to unlock this world", 0, 1)

        if rule["type"] == "default":
            return self.unlocked(rule["reason"])

        if rule["type"] == "completed_quests":
            adventure_progress = progress_summary.get(rule["adventure"], {})
            current = adventure_progress.get("completed_quests", 0)
            required = rule["required"]

            if current >= required:
                return self.unlocked("Adventure unlocked", current, required)

            return self.locked(rule["reason"], current, required)

        if rule["type"] == "total_xp":
            current = self.get_total_xp(progress_summary)
            required = rule["required"]

            if current >= required:
                return self.unlocked("Adventure unlocked", current, required)

            return self.locked(rule["reason"], current, required)

        if rule["type"] == "achievement_or_xp":
            total_xp = self.get_total_xp(progress_summary)
            achievement_count = self.get_achievement_count(db, child_id)
            current = max(total_xp, achievement_count)

            if total_xp >= rule["required_xp"] or achievement_count >= rule["required_achievements"]:
                return self.unlocked("Adventure unlocked", current, rule["required_xp"])

            return self.locked(rule["reason"], total_xp, rule["required_xp"])

        return self.locked("Keep exploring to unlock this world", 0, 1)

    def get_unlocks(self, db: Session) -> dict:
        child = self.get_child_or_create_default(db)

        try:
            progress_summary = self.progress_summary_service.get_summary(db)
        except Exception:
            progress_summary = {}

        return {
            adventure_type: self.evaluate_rule(
                db,
                child.id,
                progress_summary,
                adventure_type,
            )
            for adventure_type in ADVENTURE_TYPES
        }
