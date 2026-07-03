from sqlalchemy.orm import Session

from app.models.world_quest import WorldQuest


class WorldQuestRepository:
    def get_by_child_and_key(self, db: Session, child_id: int, quest_key: str) -> WorldQuest | None:
        return (
            db.query(WorldQuest)
            .filter(
                WorldQuest.child_id == child_id,
                WorldQuest.quest_key == quest_key,
            )
            .first()
        )

    def create(self, db: Session, world_quest: WorldQuest) -> WorldQuest:
        db.add(world_quest)
        db.flush()
        return world_quest
