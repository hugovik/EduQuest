from sqlalchemy.orm import Session

from app.models.progress_event import ProgressEvent


class ProgressEventRepository:
    def create_quest_completed_event(
        self,
        db: Session,
        child_id: int,
        quest_completion_id: int,
        title: str,
        description: str,
        xp_change: int,
    ) -> ProgressEvent:
        event = ProgressEvent(
            child_id=child_id,
            quest_completion_id=quest_completion_id,
            event_type="quest_completed",
            title=title,
            description=description,
            xp_change=xp_change,
        )
        db.add(event)
        return event

    def count_by_child(self, db: Session, child_id: int) -> int:
        return db.query(ProgressEvent).filter(ProgressEvent.child_id == child_id).count()
