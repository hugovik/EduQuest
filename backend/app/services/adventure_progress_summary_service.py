from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.quest import Quest
from app.models.quest_completion import QuestCompletion
from app.repositories.child_repository import ChildRepository

ADVENTURE_TYPES = [
    "math",
    "reading",
    "writing",
    "story",
    "geography",
    "science",
    "music",
]


class AdventureProgressSummaryService:
    def __init__(self, child_repository: ChildRepository):
        self.child_repository = child_repository

    def get_child_or_create_default(self, db: Session):
        child = self.child_repository.get_first(db)

        if child is None:
            child = self.child_repository.create_default_child(db)

        return child

    def get_status(self, completed_quests: int, total_quests: int) -> str:
        if completed_quests <= 0:
            return "not_started"

        if total_quests > 0 and completed_quests >= total_quests:
            return "completed"

        return "in_progress"

    def get_subject_summary(self, db: Session, child_id: int, subject: str, level: int) -> dict:
        total_quests = db.query(Quest).filter(Quest.subject == subject).count()
        completed_quests = (
            db.query(QuestCompletion)
            .join(Quest, QuestCompletion.quest_id == Quest.id)
            .filter(
                QuestCompletion.child_id == child_id,
                Quest.subject == subject,
            )
            .count()
        )
        xp_earned = (
            db.query(func.coalesce(func.sum(QuestCompletion.xp_awarded), 0))
            .join(Quest, QuestCompletion.quest_id == Quest.id)
            .filter(
                QuestCompletion.child_id == child_id,
                Quest.subject == subject,
            )
            .scalar()
        )

        return {
            "completed_quests": completed_quests,
            "total_quests": total_quests,
            "xp_earned": xp_earned,
            "level": level,
            "status": self.get_status(completed_quests, total_quests),
        }

    def get_default_summary(self, level: int) -> dict:
        return {
            "completed_quests": 0,
            "total_quests": 0,
            "xp_earned": 0,
            "level": level,
            "status": "not_started",
        }

    def get_summary(self, db: Session) -> dict:
        child = self.get_child_or_create_default(db)
        summary = {
            adventure_type: self.get_default_summary(child.level)
            for adventure_type in ADVENTURE_TYPES
        }
        summary["math"] = self.get_subject_summary(
            db,
            child.id,
            "math",
            child.level,
        )
        summary["reading"] = self.get_subject_summary(
            db,
            child.id,
            "reading",
            child.level,
        )

        return summary
