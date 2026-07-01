from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.quest_completion import QuestCompletion


class QuestCompletionRepository:
    def get_by_child_and_quest(
        self,
        db: Session,
        child_id: int,
        quest_id: str,
    ) -> QuestCompletion | None:
        return (
            db.query(QuestCompletion)
            .filter(
                QuestCompletion.child_id == child_id,
                QuestCompletion.quest_id == quest_id,
            )
            .first()
        )

    def create(
        self,
        db: Session,
        child_id: int,
        quest_id: str,
        xp_awarded: int,
    ) -> QuestCompletion:
        completion = QuestCompletion(
            child_id=child_id,
            quest_id=quest_id,
            xp_awarded=xp_awarded,
        )
        db.add(completion)
        db.flush()
        return completion

    def count_by_child(self, db: Session, child_id: int) -> int:
        return db.query(QuestCompletion).filter(QuestCompletion.child_id == child_id).count()

    def total_xp_awarded_by_child(self, db: Session, child_id: int) -> int:
        return (
            db.query(func.coalesce(func.sum(QuestCompletion.xp_awarded), 0))
            .filter(QuestCompletion.child_id == child_id)
            .scalar()
        )
