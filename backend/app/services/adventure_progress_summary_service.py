from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.quest import Quest
from app.models.quest_completion import QuestCompletion
from app.models.reading_passage import ReadingPassage
from app.models.reading_progress import ReadingProgress
from app.models.science_progress import ScienceProgress
from app.repositories.child_repository import ChildRepository
from app.services.reading_service import READING_PASSAGES
from app.services.science_service import SCIENCE_EXPERIMENTS

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

    def get_reading_summary(self, db: Session, child_id: int, level: int) -> dict:
        seeded_level_passages = len([
            passage for passage in READING_PASSAGES if passage["level"] == level
        ])
        total_passages = max(
            db.query(ReadingPassage).filter(ReadingPassage.level == level).count(),
            seeded_level_passages,
        )
        total_reading_quests = db.query(Quest).filter(Quest.subject == "reading").count()
        completed_passages = (
            db.query(ReadingProgress)
            .filter(
                ReadingProgress.child_id == child_id,
                ReadingProgress.level == level,
                ReadingProgress.completed.is_(True),
            )
            .count()
        )
        completed_reading_quests = (
            db.query(QuestCompletion)
            .join(Quest, QuestCompletion.quest_id == Quest.id)
            .filter(
                QuestCompletion.child_id == child_id,
                Quest.subject == "reading",
            )
            .count()
        )
        passage_xp = (
            db.query(func.coalesce(func.sum(ReadingProgress.xp_awarded), 0))
            .filter(
                ReadingProgress.child_id == child_id,
                ReadingProgress.level == level,
            )
            .scalar()
        )
        quest_xp = (
            db.query(func.coalesce(func.sum(QuestCompletion.xp_awarded), 0))
            .join(Quest, QuestCompletion.quest_id == Quest.id)
            .filter(
                QuestCompletion.child_id == child_id,
                Quest.subject == "reading",
            )
            .scalar()
        )
        questions_answered = (
            db.query(func.coalesce(func.sum(ReadingProgress.questions_answered), 0))
            .filter(
                ReadingProgress.child_id == child_id,
                ReadingProgress.level == level,
                ReadingProgress.completed.is_(True),
            )
            .scalar()
        )
        correct_answers = (
            db.query(func.coalesce(func.sum(ReadingProgress.correct_answers), 0))
            .filter(
                ReadingProgress.child_id == child_id,
                ReadingProgress.level == level,
                ReadingProgress.completed.is_(True),
            )
            .scalar()
        )
        vocabulary_learned = (
            db.query(func.coalesce(func.sum(ReadingProgress.vocabulary_learned), 0))
            .filter(
                ReadingProgress.child_id == child_id,
                ReadingProgress.level == level,
                ReadingProgress.completed.is_(True),
            )
            .scalar()
        )
        completed = completed_passages + completed_reading_quests
        total = total_passages + total_reading_quests

        return {
            "completed_quests": completed,
            "total_quests": total,
            "xp_earned": passage_xp + quest_xp,
            "level": level,
            "status": self.get_status(completed, total),
            "questions_answered": questions_answered,
            "accuracy": correct_answers / questions_answered if questions_answered else 0,
            "vocabulary_learned": vocabulary_learned,
        }

    def get_default_summary(self, level: int) -> dict:
        return {
            "completed_quests": 0,
            "total_quests": 0,
            "xp_earned": 0,
            "level": level,
            "status": "not_started",
        }

    def get_science_summary(self, db: Session, child_id: int, level: int) -> dict:
        completed_experiments = (
            db.query(ScienceProgress)
            .filter(
                ScienceProgress.child_id == child_id,
                ScienceProgress.completed.is_(True),
            )
            .count()
        )
        xp_earned = (
            db.query(func.coalesce(func.sum(ScienceProgress.xp_awarded), 0))
            .filter(
                ScienceProgress.child_id == child_id,
                ScienceProgress.completed.is_(True),
            )
            .scalar()
        )
        total_experiments = len(SCIENCE_EXPERIMENTS)

        return {
            "completed_quests": completed_experiments,
            "total_quests": total_experiments,
            "xp_earned": xp_earned,
            "level": level,
            "status": self.get_status(completed_experiments, total_experiments),
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
        summary["reading"] = self.get_reading_summary(
            db,
            child.id,
            child.grade or child.level,
        )
        summary["writing"] = self.get_subject_summary(
            db,
            child.id,
            "writing",
            child.level,
        )
        summary["science"] = self.get_science_summary(
            db,
            child.id,
            child.level,
        )

        return summary
