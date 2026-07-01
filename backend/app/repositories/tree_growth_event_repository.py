from sqlalchemy.orm import Session

from app.models.tree_growth_event import TreeGrowthEvent


class TreeGrowthEventRepository:
    def create_growth_event(
        self,
        db: Session,
        child_id: int,
        quest_completion_id: int,
        growth_type: str,
        description: str,
    ) -> TreeGrowthEvent:
        event = TreeGrowthEvent(
            child_id=child_id,
            quest_completion_id=quest_completion_id,
            growth_type=growth_type,
            description=description,
        )
        db.add(event)
        return event

    def count_by_child(self, db: Session, child_id: int) -> int:
        return db.query(TreeGrowthEvent).filter(TreeGrowthEvent.child_id == child_id).count()
