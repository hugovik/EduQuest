from datetime import datetime

from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.child import Child
from app.models.science_progress import ScienceProgress
from app.repositories.child_repository import ChildRepository
from app.services.achievement_service import AchievementService
from app.services.adventure_completion_service import AdventureCompletionService


SCIENCE_EXPERIMENTS = {
    "electricity-1": {"id": "electricity-1", "title": "Light the Bulb", "xp": 10},
    "electricity-2": {"id": "electricity-2", "title": "Power Source", "xp": 15},
    "electricity-3": {"id": "electricity-3", "title": "Complete the Circuit", "xp": 20},
    "electricity-4": {"id": "electricity-4", "title": "Build the Circuit", "xp": 20},
    "electricity-5": {"id": "electricity-5", "title": "What Happens Next?", "xp": 25},
    "magnets-1": {"id": "magnets-1", "title": "Magnet Mystery", "xp": 15},
    "magnets-2": {"id": "magnets-2", "title": "Magnetic or Not?", "xp": 15},
    "magnets-3": {"id": "magnets-3", "title": "Strong vs Weak", "xp": 20},
    "magnets-4": {"id": "magnets-4", "title": "Find the Hidden Magnet", "xp": 20},
    "magnets-5": {"id": "magnets-5", "title": "Compass Adventure", "xp": 25},
}

SCIENCE_EXPERIMENT_ORDER = list(SCIENCE_EXPERIMENTS.keys())


class ScienceService:
    def __init__(
        self,
        child_repository: ChildRepository,
        completion_service: AdventureCompletionService,
        achievement_service: AchievementService | None = None,
    ):
        self.child_repository = child_repository
        self.completion_service = completion_service
        self.achievement_service = achievement_service

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

    def get_completed_experiment_ids(self, db: Session, child_id: int) -> set[str]:
        return {
            row.experiment_id
            for row in self.get_progress_rows(db, child_id)
        }

    def validate_experiment_unlocked(
        self,
        db: Session,
        child_id: int,
        experiment_id: str,
    ) -> None:
        experiment_index = SCIENCE_EXPERIMENT_ORDER.index(experiment_id)

        if experiment_index == 0:
            return

        previous_experiment_id = SCIENCE_EXPERIMENT_ORDER[experiment_index - 1]
        completed_experiment_ids = self.get_completed_experiment_ids(db, child_id)

        if previous_experiment_id in completed_experiment_ids:
            return

        previous_experiment = SCIENCE_EXPERIMENTS[previous_experiment_id]
        raise HTTPException(
            status_code=403,
            detail=(
                f"Complete {previous_experiment['title']} to unlock "
                f"{SCIENCE_EXPERIMENTS[experiment_id]['title']}."
            ),
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
                "achievements_unlocked": [],
                "completed_at": existing_progress.completed_at,
            }

        self.validate_experiment_unlocked(db, child.id, experiment_id)

        xp_awarded = experiment["xp"]

        progress = existing_progress or ScienceProgress(
            child_id=child.id,
            experiment_id=experiment_id,
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
            event_type="science_experiment_completed",
            title=f"Completed {experiment['title']}",
            description=f"{child.name} completed a Science Lab experiment.",
            growth_type="science_discovery",
            growth_description="The Tree of Growth shimmered with science energy.",
        )
        achievements_unlocked = []
        if self.achievement_service is not None:
            achievements_unlocked = self.achievement_service.evaluate(
                db,
                "science_experiment_completed",
                child=child,
                source_adventure="science",
                metadata=experiment_id,
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
            "achievements_unlocked": achievements_unlocked,
            "completed_at": progress.completed_at,
        }
