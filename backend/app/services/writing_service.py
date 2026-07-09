from datetime import datetime

from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.child import Child
from app.models.writing_progress import WritingProgress
from app.repositories.child_repository import ChildRepository
from app.services.adventure_completion_service import AdventureCompletionService


WRITING_LESSONS = {
    "missing-period-1": {"id": "missing-period-1", "title": "The Missing Period", "xp": 5},
    "missing-question-1": {"id": "missing-question-1", "title": "The Missing Question Mark", "xp": 5},
    "missing-exclamation-1": {"id": "missing-exclamation-1", "title": "The Missing Exclamation Mark", "xp": 5},
    "missing-capital-1": {"id": "missing-capital-1", "title": "The Missing Capital Letter", "xp": 5},
    "missing-word-1": {"id": "missing-word-1", "title": "The Missing Word", "xp": 5},
    "sentence-order-1": {"id": "sentence-order-1", "title": "The Broken Sentence", "xp": 10},
    "grammar-choice-1": {"id": "grammar-choice-1", "title": "The Royal Grammar Test", "xp": 10},
}


class WritingService:
    def __init__(
        self,
        child_repository: ChildRepository,
        completion_service: AdventureCompletionService,
    ):
        self.child_repository = child_repository
        self.completion_service = completion_service

    def get_child_or_create_default(self, db: Session) -> Child:
        child = self.child_repository.get_first(db)

        if child is None:
            child = self.child_repository.create_default_child(db)

        return child

    def get_lesson(self, lesson_id: str) -> dict:
        lesson = WRITING_LESSONS.get(lesson_id)

        if lesson is None:
            raise HTTPException(status_code=404, detail="Writing lesson not found")

        return lesson

    def get_progress_rows(self, db: Session, child_id: int) -> list[WritingProgress]:
        return (
            db.query(WritingProgress)
            .filter(
                WritingProgress.child_id == child_id,
                WritingProgress.completed.is_(True),
            )
            .order_by(WritingProgress.completed_at.asc())
            .all()
        )

    def serialize_progress(self, db: Session, child_id: int) -> dict:
        completed_rows = self.get_progress_rows(db, child_id)
        xp_earned = int(
            db.query(func.coalesce(func.sum(WritingProgress.xp_awarded), 0))
            .filter(
                WritingProgress.child_id == child_id,
                WritingProgress.completed.is_(True),
            )
            .scalar()
            or 0
        )

        return {
            "completed_lessons": [row.lesson_id for row in completed_rows],
            "lessons_completed": len(completed_rows),
            "total_lessons": len(WRITING_LESSONS),
            "xp_earned": xp_earned,
        }

    def get_progress(self, db: Session) -> dict:
        child = self.get_child_or_create_default(db)
        return self.serialize_progress(db, child.id)

    def complete_lesson(self, db: Session, lesson_id: str) -> dict:
        child = self.get_child_or_create_default(db)
        lesson = self.get_lesson(lesson_id)
        existing_progress = (
            db.query(WritingProgress)
            .filter(
                WritingProgress.child_id == child.id,
                WritingProgress.lesson_id == lesson_id,
            )
            .one_or_none()
        )

        if existing_progress is not None and existing_progress.completed:
            return {
                "lesson_id": lesson_id,
                "completed": True,
                "already_completed": True,
                "xp_awarded": 0,
                "total_xp": child.xp,
                "child": child,
                "progress": self.serialize_progress(db, child.id),
                "achievements_unlocked": [],
                "completed_at": existing_progress.completed_at,
            }

        xp_awarded = lesson["xp"]
        progress = existing_progress or WritingProgress(
            child_id=child.id,
            lesson_id=lesson_id,
        )
        progress.xp_awarded = xp_awarded
        progress.completed = True
        progress.completed_at = datetime.utcnow()

        if existing_progress is None:
            db.add(progress)

        self.completion_service.apply_xp_reward(
            db,
            child,
            xp_awarded=xp_awarded,
            event_type="writing_lesson_completed",
            title=f"Completed {lesson['title']}",
            description=f"{child.name} restored a Writing Kingdom lesson.",
            growth_type="writing_magic",
            growth_description="The Tree of Growth shimmered with royal word magic.",
        )

        db.commit()
        db.refresh(child)
        db.refresh(progress)

        return {
            "lesson_id": lesson_id,
            "completed": True,
            "already_completed": False,
            "xp_awarded": xp_awarded,
            "total_xp": child.xp,
            "child": child,
            "progress": self.serialize_progress(db, child.id),
            "achievements_unlocked": [],
            "completed_at": progress.completed_at,
        }
