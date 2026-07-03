from sqlalchemy.orm import Session

from app.models.world_state import WorldState


class WorldStateRepository:
    def get_by_child_id(self, db: Session, child_id: int) -> WorldState | None:
        return db.query(WorldState).filter(WorldState.child_id == child_id).first()

    def create_for_child(self, db: Session, child_id: int) -> WorldState:
        world_state = WorldState(
            child_id=child_id,
            active_location="treehouse",
            last_region=None,
            unlocked_regions="[]",
            visited_regions="[]",
        )
        db.add(world_state)
        db.commit()
        db.refresh(world_state)
        return world_state
