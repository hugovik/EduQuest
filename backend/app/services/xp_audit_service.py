from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.achievement import Achievement
from app.models.achievement_unlock import AchievementUnlock
from app.models.progress_event import ProgressEvent
from app.models.quest import Quest
from app.models.quest_completion import QuestCompletion
from app.models.reading_progress import ReadingProgress
from app.repositories.child_repository import ChildRepository


class XPAuditService:
    def __init__(self, child_repository: ChildRepository):
        self.child_repository = child_repository

    def get_child_or_create_default(self, db: Session):
        child = self.child_repository.get_first(db)

        if child is None:
            child = self.child_repository.create_default_child(db)

        return child

    def get_reading_passage_xp(self, db: Session, child_id: int) -> int:
        return int(
            db.query(func.coalesce(func.sum(ReadingProgress.xp_awarded), 0))
            .filter(
                ReadingProgress.child_id == child_id,
                ReadingProgress.completed.is_(True),
            )
            .scalar()
            or 0
        )

    def get_reading_passage_xp_by_level(self, db: Session, child_id: int) -> list[dict]:
        rows = (
            db.query(
                ReadingProgress.level,
                func.count(ReadingProgress.id),
                func.coalesce(func.sum(ReadingProgress.xp_awarded), 0),
            )
            .filter(
                ReadingProgress.child_id == child_id,
                ReadingProgress.completed.is_(True),
            )
            .group_by(ReadingProgress.level)
            .order_by(ReadingProgress.level.asc())
            .all()
        )
        return [
            {
                "level": int(level),
                "completed_passages": int(completed_count or 0),
                "xp": int(xp or 0),
            }
            for level, completed_count, xp in rows
        ]

    def get_quest_completion_xp_by_subject(self, db: Session, child_id: int) -> dict[str, int]:
        rows = (
            db.query(Quest.subject, func.coalesce(func.sum(QuestCompletion.xp_awarded), 0))
            .join(Quest, QuestCompletion.quest_id == Quest.id)
            .filter(QuestCompletion.child_id == child_id)
            .group_by(Quest.subject)
            .all()
        )
        return {subject or "unknown": int(total or 0) for subject, total in rows}

    def get_achievement_xp(self, db: Session, child_id: int) -> int:
        return int(
            db.query(func.coalesce(func.sum(Achievement.xp_bonus), 0))
            .join(AchievementUnlock, AchievementUnlock.achievement_id == Achievement.id)
            .filter(AchievementUnlock.child_id == child_id)
            .scalar()
            or 0
        )

    def get_penalty_xp(self, db: Session, child_id: int) -> int:
        return int(
            db.query(func.coalesce(func.sum(ProgressEvent.xp_change), 0))
            .filter(
                ProgressEvent.child_id == child_id,
                ProgressEvent.xp_change < 0,
            )
            .scalar()
            or 0
        )

    def get_world_quest_xp(self, db: Session, child_id: int) -> int:
        return int(
            db.query(func.coalesce(func.sum(ProgressEvent.xp_change), 0))
            .filter(
                ProgressEvent.child_id == child_id,
                ProgressEvent.event_type == "world_quest_reward",
                ProgressEvent.xp_change > 0,
            )
            .scalar()
            or 0
        )

    def get_audit(self, db: Session) -> dict:
        child = self.get_child_or_create_default(db)
        current_reading_level = child.grade or child.level
        reading_passage_xp_by_level = self.get_reading_passage_xp_by_level(db, child.id)
        reading_passage_xp = sum(item["xp"] for item in reading_passage_xp_by_level)
        current_reading_level_xp = sum(
            item["xp"]
            for item in reading_passage_xp_by_level
            if item["level"] == current_reading_level
        )
        hidden_reading_xp = reading_passage_xp - current_reading_level_xp
        quest_completion_xp_by_subject = self.get_quest_completion_xp_by_subject(db, child.id)
        quest_completion_xp = sum(quest_completion_xp_by_subject.values())
        achievement_xp = self.get_achievement_xp(db, child.id)
        penalty_xp = self.get_penalty_xp(db, child.id)
        world_quest_xp = self.get_world_quest_xp(db, child.id)
        adventure_xp_total = reading_passage_xp + quest_completion_xp
        reconciled_xp = adventure_xp_total + achievement_xp + world_quest_xp + penalty_xp
        unexplained_xp = child.xp - reconciled_xp

        return {
            "child_id": child.id,
            "child_grade": child.grade,
            "child_level": child.level,
            "child_xp": child.xp,
            "current_reading_level": current_reading_level,
            "current_reading_level_xp": current_reading_level_xp,
            "reading_passage_xp": reading_passage_xp,
            "reading_passage_xp_by_level": reading_passage_xp_by_level,
            "hidden_reading_xp": hidden_reading_xp,
            "quest_completion_xp": quest_completion_xp,
            "quest_completion_xp_by_subject": quest_completion_xp_by_subject,
            "adventure_xp_total": adventure_xp_total,
            "achievement_xp": achievement_xp,
            "world_quest_xp": world_quest_xp,
            "penalty_xp": penalty_xp,
            "reconciled_xp": reconciled_xp,
            "unexplained_xp": unexplained_xp,
            "matches_total": unexplained_xp == 0,
            "note": (
                "child_xp matches recorded XP sources."
                if unexplained_xp == 0
                else "child_xp does not match recorded XP sources. Check hidden_reading_xp and reading_passage_xp_by_level for progress outside the currently visible Reading Forest level."
            ),
        }
