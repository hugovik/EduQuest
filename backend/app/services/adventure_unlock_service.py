from sqlalchemy.orm import Session

from app.models.achievement_unlock import AchievementUnlock
from app.repositories.child_repository import ChildRepository
from app.services.adventure_progress_summary_service import AdventureProgressSummaryService

WORLD_REGION_RULES = [
    {
        "region_key": "treehouse",
        "title": "Treehouse",
        "adventure_type": "home",
        "status": "unlocked",
        "lock_reason": None,
        "unlock_requirement": None,
        "coming_soon": False,
    },
    {
        "region_key": "world",
        "title": "World Map",
        "adventure_type": "world",
        "status": "unlocked",
        "lock_reason": None,
        "unlock_requirement": None,
        "coming_soon": False,
    },
    {
        "region_key": "math",
        "title": "Math Mountains",
        "adventure_type": "math",
        "status": "unlocked",
        "lock_reason": None,
        "unlock_requirement": None,
        "coming_soon": False,
    },
    {
        "region_key": "reading",
        "title": "Reading Forest",
        "adventure_type": "reading",
        "status": "unlocked",
        "lock_reason": None,
        "unlock_requirement": None,
        "coming_soon": False,
    },
    {
        "region_key": "writing",
        "title": "Writing Kingdom",
        "adventure_type": "writing",
        "status": "unlocked",
        "lock_reason": None,
        "unlock_requirement": None,
        "coming_soon": False,
    },
    {
        "region_key": "science",
        "title": "Science Lab",
        "adventure_type": "science",
        "status": "unlocked",
        "lock_reason": None,
        "unlock_requirement": None,
        "coming_soon": False,
    },
    {
        "region_key": "geography",
        "title": "Geography Harbor",
        "adventure_type": "geography",
        "status": "coming_soon",
        "lock_reason": "Geography Harbor is coming soon.",
        "unlock_requirement": "Complete the first Science Lab milestone to unlock Geography Harbor.",
        "coming_soon": True,
    },
    {
        "region_key": "music",
        "title": "Music Meadow",
        "adventure_type": "music",
        "status": "coming_soon",
        "lock_reason": "Music Meadow is coming soon.",
        "unlock_requirement": "Complete the first Geography Harbor milestone to unlock Music Meadow.",
        "coming_soon": True,
    },
]

ADVENTURE_UNLOCK_KEYS = ["math", "reading", "writing", "science", "geography", "music"]


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
            "is_unlocked": True,
            "is_available": True,
            "coming_soon": False,
            "reason": reason,
            "lock_reason": None,
            "unlock_requirement": None,
            "current": current,
            "required": required,
        }

    def locked(self, reason: str, current: int = 0, required: int = 1, coming_soon: bool = False) -> dict:
        return {
            "unlocked": False,
            "is_unlocked": False,
            "is_available": False,
            "coming_soon": coming_soon,
            "reason": reason,
            "lock_reason": reason,
            "unlock_requirement": reason,
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
        region = self.get_region_rule(adventure_type)

        if region is None:
            return self.locked("Keep exploring to unlock this world")

        if region["status"] == "unlocked":
            return self.unlocked("Unlocked by default")

        return self.locked(
            region["lock_reason"],
            coming_soon=region["coming_soon"],
        )

    def get_region_rule(self, region_key: str) -> dict | None:
        return next(
            (region for region in WORLD_REGION_RULES if region["region_key"] == region_key),
            None,
        )

    def serialize_region(self, region: dict, progress_summary: dict) -> dict:
        is_unlocked = region["status"] == "unlocked"
        progress = progress_summary.get(region["adventure_type"], {})
        return {
            "region_key": region["region_key"],
            "title": region["title"],
            "adventure_type": region["adventure_type"],
            "status": region["status"],
            "is_unlocked": is_unlocked,
            "is_available": is_unlocked and not region["coming_soon"],
            "lock_reason": region["lock_reason"],
            "unlock_requirement": region["unlock_requirement"],
            "coming_soon": region["coming_soon"],
            "progress": progress,
        }

    def get_regions(self, db: Session) -> list[dict]:
        try:
            progress_summary = self.progress_summary_service.get_summary(db)
        except Exception:
            progress_summary = {}

        return [
            self.serialize_region(region, progress_summary)
            for region in WORLD_REGION_RULES
        ]

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
            for adventure_type in ADVENTURE_UNLOCK_KEYS
        }
