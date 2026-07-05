from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.quest import Quest
from app.models.quest_completion import QuestCompletion
from app.models.reading_progress import ReadingProgress
from app.services.adventure_progress_summary_service import AdventureProgressSummaryService
from app.services.adventure_unlock_service import AdventureUnlockService


ADVENTURE_REGISTRY = [
    {
        "id": "tree-house",
        "title": "Tree House",
        "description": "Return home, check your tree, and see today's quest.",
        "icon": "tree",
        "route": "treehouse",
        "status": "playable",
        "subject": "home",
        "theme": "home",
        "is_playable": True,
        "is_coming_soon": False,
        "required_regions": [],
    },
    {
        "id": "math-mountains",
        "title": "Math Mountains",
        "description": "Clear mountain obstacles by solving number challenges.",
        "icon": "mountain",
        "route": "math",
        "status": "playable",
        "subject": "math",
        "theme": "mountain",
        "is_playable": True,
        "is_coming_soon": False,
        "required_regions": [],
    },
    {
        "id": "reading-forest",
        "title": "Reading Forest",
        "description": "Follow forest stories, clues, and comprehension quests.",
        "icon": "book",
        "route": "reading",
        "status": "playable",
        "subject": "reading",
        "theme": "forest",
        "is_playable": True,
        "is_coming_soon": False,
        "required_regions": [],
    },
    {
        "id": "writing-kingdom",
        "title": "Writing Kingdom",
        "description": "Restore magical books by rebuilding sentences, punctuation, and stories.",
        "icon": "castle",
        "route": "writing",
        "status": "playable",
        "subject": "writing",
        "theme": "kingdom",
        "is_playable": True,
        "is_coming_soon": False,
        "required_regions": ["math-mountains", "reading-forest"],
    },
    {
        "id": "science-lab",
        "title": "Science Lab",
        "description": "Experiment, observe, and unlock curious discoveries.",
        "icon": "microscope",
        "route": "science",
        "status": "coming_soon",
        "subject": "science",
        "theme": "lab",
        "is_playable": False,
        "is_coming_soon": True,
        "required_regions": ["writing-kingdom"],
    },
    {
        "id": "geography-island",
        "title": "Geography Island",
        "description": "Sail maps, places, landforms, and world clues.",
        "icon": "anchor",
        "route": "geography",
        "status": "coming_soon",
        "subject": "geography",
        "theme": "island",
        "is_playable": False,
        "is_coming_soon": True,
        "required_regions": ["science-lab"],
    },
    {
        "id": "music-valley",
        "title": "Music Valley",
        "description": "Explore rhythm, sound, and musical patterns.",
        "icon": "music",
        "route": "music",
        "status": "coming_soon",
        "subject": "music",
        "theme": "valley",
        "is_playable": False,
        "is_coming_soon": True,
        "required_regions": ["geography-island"],
    },
]


class AdventureService:
    def __init__(
        self,
        progress_summary_service: AdventureProgressSummaryService,
        adventure_unlock_service: AdventureUnlockService,
    ):
        self.progress_summary_service = progress_summary_service
        self.adventure_unlock_service = adventure_unlock_service

    def find_adventure(self, adventure_id: str) -> dict | None:
        return next(
            (
                adventure
                for adventure in ADVENTURE_REGISTRY
                if adventure["id"] == adventure_id
                or adventure["subject"] == adventure_id
                or adventure["route"] == adventure_id
            ),
            None,
        )

    def get_unlock_state(self, db: Session, adventure: dict) -> dict:
        if adventure["subject"] == "home":
            return {
                "is_unlocked": True,
                "is_available": True,
            }

        try:
            unlocks = self.adventure_unlock_service.get_unlocks(db)
        except Exception:
            unlocks = {}

        unlock_state = unlocks.get(adventure["subject"], {})
        return {
            "is_unlocked": unlock_state.get("is_unlocked", adventure["is_playable"]),
            "is_available": unlock_state.get("is_available", adventure["is_playable"]),
        }

    def get_progress_summary(self, db: Session) -> dict:
        try:
            return self.progress_summary_service.get_summary(db)
        except Exception:
            return {}

    def serialize_adventure(self, db: Session, adventure: dict, progress_summary: dict) -> dict:
        progress = progress_summary.get(adventure["subject"], {})
        unlock_state = self.get_unlock_state(db, adventure)
        return {
            **adventure,
            "is_unlocked": unlock_state["is_unlocked"],
            "is_completed": progress.get("status") == "completed",
        }

    def get_adventures(self, db: Session) -> list[dict]:
        progress_summary = self.get_progress_summary(db)
        return [
            self.serialize_adventure(db, adventure, progress_summary)
            for adventure in ADVENTURE_REGISTRY
        ]

    def get_adventure(self, db: Session, adventure_id: str) -> dict | None:
        adventure = self.find_adventure(adventure_id)

        if adventure is None:
            return None

        return self.serialize_adventure(db, adventure, self.get_progress_summary(db))

    def get_math_last_activity(self, db: Session, child_id: int):
        return (
            db.query(func.max(QuestCompletion.completed_at))
            .join(Quest, QuestCompletion.quest_id == Quest.id)
            .filter(
                QuestCompletion.child_id == child_id,
                Quest.subject == "math",
            )
            .scalar()
        )

    def get_reading_answer_counts(self, db: Session, child_id: int, level: int) -> tuple[int, int]:
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

        return correct_answers, max(questions_answered - correct_answers, 0)

    def get_reading_last_activity(self, db: Session, child_id: int, level: int):
        return (
            db.query(func.max(ReadingProgress.updated_at))
            .filter(
                ReadingProgress.child_id == child_id,
                ReadingProgress.level == level,
                ReadingProgress.completed.is_(True),
            )
            .scalar()
        )

    def get_adventure_progress(self, db: Session, adventure_id: str) -> dict | None:
        adventure = self.find_adventure(adventure_id)

        if adventure is None:
            return None

        child = self.progress_summary_service.get_child_or_create_default(db)
        progress_summary = self.get_progress_summary(db)
        progress = progress_summary.get(adventure["subject"], {})
        completed = progress.get("completed_quests", 0)
        total = progress.get("total_quests", 0)
        subject = adventure["subject"]
        correct_answers = completed if subject == "math" else 0
        incorrect_answers = 0
        last_activity = None

        if subject == "math":
            last_activity = self.get_math_last_activity(db, child.id)
        elif subject == "reading":
            correct_answers, incorrect_answers = self.get_reading_answer_counts(
                db,
                child.id,
                child.grade or child.level,
            )
            last_activity = self.get_reading_last_activity(
                db,
                child.id,
                child.grade or child.level,
            )

        unlock_state = self.get_unlock_state(db, adventure)

        return {
            "adventure_id": adventure["id"],
            "title": adventure["title"],
            "subject": subject,
            "activities_completed": completed,
            "correct_answers": correct_answers,
            "incorrect_answers": incorrect_answers,
            "xp_earned": progress.get("xp_earned", 0),
            "completion_percent": round((completed / total) * 100) if total else 0,
            "is_unlocked": unlock_state["is_unlocked"],
            "is_completed": progress.get("status") == "completed",
            "last_activity": last_activity,
        }
