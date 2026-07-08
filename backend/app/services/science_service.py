from datetime import datetime

from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.child import Child
from app.models.progress_event import ProgressEvent
from app.models.science_progress import ScienceProgress
from app.models.tree_growth_event import TreeGrowthEvent
from app.repositories.child_repository import ChildRepository
from app.services.progression_rules import (
    calculate_level_from_xp,
    calculate_tree_stage_from_xp,
)


SCIENCE_EXPERIMENTS = {
    "electricity-1": {"id": "electricity-1", "title": "Light the Bulb", "xp": 10},
    "electricity-2": {"id": "electricity-2", "title": "Power Source", "xp": 15},
    "electricity-3": {"id": "electricity-3", "title": "Complete the Circuit", "xp": 20},
    "electricity-4": {"id": "electricity-4", "title": "Build the Circuit", "xp": 20},
    "electricity-5": {"id": "electricity-5", "title": "What Happens Next?", "xp": 25},
    "magnets-1": {"id": "magnets-1", "title": "Magnet Mystery", "xp": 15},
}


class ScienceService:
    def __init__(self, child_repository: ChildRepository):
        self.child_repository = child_repository

    def get_child_or_create_default(self, db: Session) -> Child:
        child = self.child_repository.get_first(db)

        if child is None:
            child = self.child_repository.create_default_child(db)

        return child

    def get_experiment(self, experiment_id: str) -> dict:
        experiment = SCIENCE_EXPERIMENTS.get(experiment_id)

        if experiment is None:
            raise HTTPException(status_code=404, detail="Science experiment not found")

        return experiment

    def list_experiments(self) -> list[dict]:
        return list(SCIENCE_EXPERIMENTS.values())

    def get_progress_rows(self, db: Session, child_id: int) -> list[ScienceProgress]:
        return (
            db.query(ScienceProgress)
            .filter(
                ScienceProgress.child_id == child_id,
                ScienceProgress.completed.is_(True),
            )
            .order_by(ScienceProgress.completed_at.asc())
            .all()
        )

    def serialize_progress(self, db: Session, child_id: int) -> dict:
        completed_rows = self.get_progress_rows(db, child_id)
        xp_earned = int(
            db.query(func.coalesce(func.sum(ScienceProgress.xp_awarded), 0))
            .filter(
                ScienceProgress.child_id == child_id,
                ScienceProgress.completed.is_(True),
            )
            .scalar()
            or 0
        )

        return {
            "completed_experiments": [row.experiment_id for row in completed_rows],
            "experiments_completed": len(completed_rows),
            "total_experiments": len(SCIENCE_EXPERIMENTS),
            "xp_earned": xp_earned,
        }

    def get_progress(self, db: Session) -> dict:
        child = self.get_child_or_create_default(db)
        return self.serialize_progress(db, child.id)

    def complete_experiment(self, db: Session, experiment_id: str) -> dict:
        child = self.get_child_or_create_default(db)
        experiment = self.get_experiment(experiment_id)
        existing_progress = (
            db.query(ScienceProgress)
            .filter(
                ScienceProgress.child_id == child.id,
                ScienceProgress.experiment_id == experiment_id,
            )
            .one_or_none()
        )

        if existing_progress is not None and existing_progress.completed:
            return {
                "experiment_id": experiment_id,
                "completed": True,
                "xp_awarded": 0,
                "total_xp": child.xp,
                "already_completed": True,
                "child": child,
                "progress": self.serialize_progress(db, child.id),
                "completed_at": existing_progress.completed_at,
            }

        previous_tree_stage = child.tree_stage
        xp_awarded = experiment["xp"]
        child.xp += xp_awarded
        child.level = calculate_level_from_xp(child.xp)
        child.tree_stage = calculate_tree_stage_from_xp(child.xp)

        progress = existing_progress or ScienceProgress(
            child_id=child.id,
            experiment_id=experiment_id,
        )
        progress.xp_awarded = xp_awarded
        progress.completed = True
        progress.completed_at = datetime.utcnow()

        if existing_progress is None:
            db.add(progress)

        db.add(
            ProgressEvent(
                child_id=child.id,
                quest_completion_id=None,
                event_type="science_experiment_completed",
                title=f"Completed {experiment['title']}",
                description=f"{child.name} completed a Science Lab experiment.",
                xp_change=xp_awarded,
            )
        )
        db.add(
            TreeGrowthEvent(
                child_id=child.id,
                quest_completion_id=None,
                growth_type="science_discovery"
                if child.tree_stage != previous_tree_stage
                else "science_spark",
                description="The Tree of Growth shimmered with science energy.",
            )
        )

        db.commit()
        db.refresh(child)
        db.refresh(progress)

        return {
            "experiment_id": experiment_id,
            "completed": True,
            "xp_awarded": xp_awarded,
            "total_xp": child.xp,
            "already_completed": False,
            "child": child,
            "progress": self.serialize_progress(db, child.id),
            "completed_at": progress.completed_at,
        }
