from sqlalchemy.orm import Session

from app.models.obstacle_progress import ObstacleProgress


class ObstacleProgressRepository:
    def get_by_child_and_obstacle(
        self,
        db: Session,
        child_id: int,
        obstacle_id: str,
    ) -> ObstacleProgress | None:
        return (
            db.query(ObstacleProgress)
            .filter(
                ObstacleProgress.child_id == child_id,
                ObstacleProgress.obstacle_id == obstacle_id,
            )
            .first()
        )

    def get_or_create(
        self,
        db: Session,
        child_id: int,
        obstacle_id: str,
        required_progress: int,
    ) -> ObstacleProgress:
        progress = self.get_by_child_and_obstacle(db, child_id, obstacle_id)

        if progress is None:
            progress = ObstacleProgress(
                child_id=child_id,
                obstacle_id=obstacle_id,
                current_progress=0,
                required_progress=required_progress,
                completed=False,
                completion_reward_awarded=False,
            )
            db.add(progress)
            db.flush()

        return progress

    def list_by_child(self, db: Session, child_id: int) -> list[ObstacleProgress]:
        return db.query(ObstacleProgress).filter(ObstacleProgress.child_id == child_id).all()
