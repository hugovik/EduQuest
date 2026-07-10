from datetime import datetime

from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.content.science_registry import (
    SCIENCE_EXPERIMENTS,
    SCIENCE_TOPICS,
    get_science_experiment,
    get_science_experiment_xp,
    get_science_topic,
    get_science_topic_experiments,
    get_total_science_experiments,
    is_science_topic_complete,
)
from app.models.child import Child
from app.models.science_progress import ScienceProgress
from app.repositories.child_repository import ChildRepository
from app.services.achievement_service import AchievementService
from app.services.adventure_completion_service import AdventureCompletionService
from app.services.inventory_service import InventoryService


class ScienceService:
    def __init__(
        self,
        child_repository: ChildRepository,
        completion_service: AdventureCompletionService,
        achievement_service: AchievementService | None = None,
        inventory_service: InventoryService | None = None,
    ):
        self.child_repository = child_repository
        self.completion_service = completion_service
        self.achievement_service = achievement_service
        self.inventory_service = inventory_service

    def get_child_or_create_default(self, db: Session) -> Child:
        child = self.child_repository.get_first(db)

        if child is None:
            child = self.child_repository.create_default_child(db)

        return child

    def get_experiment(self, experiment_id: str) -> dict:
        experiment = get_science_experiment(experiment_id)

        if experiment is None:
            raise HTTPException(status_code=404, detail="Science experiment not found")

        return experiment

    def list_experiments(self) -> list[dict]:
        return [
            {
                **experiment,
                "xp": experiment["xp_reward"],
            }
            for experiment in SCIENCE_EXPERIMENTS
        ]

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
        experiment = self.get_experiment(experiment_id)
        required_experiment_id = experiment.get("requires")

        if required_experiment_id is None:
            return

        completed_experiment_ids = self.get_completed_experiment_ids(db, child_id)

        if required_experiment_id in completed_experiment_ids:
            return

        required_experiment = self.get_experiment(required_experiment_id)
        raise HTTPException(
            status_code=403,
            detail=(
                f"Complete {required_experiment['title']} to unlock "
                f"{experiment['title']}."
            ),
        )

    def serialize_progress(self, db: Session, child_id: int) -> dict:
        completed_rows = self.get_progress_rows(db, child_id)
        completed_experiment_ids = [row.experiment_id for row in completed_rows]
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
            "completed_experiments": completed_experiment_ids,
            "experiments_completed": len(completed_rows),
            "total_experiments": get_total_science_experiments(),
            "xp_earned": xp_earned,
            "topics": self.serialize_topic_summaries(
                db,
                child_id,
                completed_experiment_ids,
            ),
        }

    def serialize_topic_summaries(
        self,
        db: Session,
        child_id: int,
        completed_experiment_ids: list[str],
    ) -> list[dict]:
        completed_ids = set(completed_experiment_ids)
        topic_summaries = []

        for topic in SCIENCE_TOPICS:
            topic_experiments = get_science_topic_experiments(topic["id"])
            completed_count = len(
                [
                    experiment
                    for experiment in topic_experiments
                    if experiment["id"] in completed_ids
                ]
            )
            total_count = len(topic_experiments)
            completed = total_count > 0 and completed_count == total_count
            reward = topic.get("completion_reward") or {}
            reward_item_key = reward.get("item_key")
            reward_earned = False

            if reward_item_key and self.inventory_service is not None:
                reward_earned = self.inventory_service.has_item(
                    db,
                    child_id,
                    reward_item_key,
                )
            else:
                reward_earned = completed

            topic_summaries.append(
                {
                    "id": topic["id"],
                    "title": topic["title"],
                    "completed": completed,
                    "completed_experiments": completed_count,
                    "total_experiments": total_count,
                    "progress_percent": 0
                    if total_count == 0
                    else round((completed_count / total_count) * 100),
                    "reward_earned": reward_earned,
                }
            )

        return topic_summaries

    def grant_topic_reward_once(
        self,
        db: Session,
        child_id: int,
        topic: dict,
    ) -> dict | None:
        if self.inventory_service is None:
            return None

        reward = topic.get("completion_reward")
        if not reward:
            return None

        granted_item = self.inventory_service.add_item_once(
            db,
            child_id,
            reward["item_key"],
            source_region="science",
            commit=False,
        )

        if granted_item is None:
            return None

        return {
            "item_key": reward["item_key"],
            "name": reward["name"],
            "description": reward["description"],
            "icon": reward.get("icon"),
            "quantity": reward.get("quantity", 1),
        }

    def get_progress(self, db: Session) -> dict:
        child = self.get_child_or_create_default(db)
        return self.serialize_progress(db, child.id)

    def complete_experiment(self, db: Session, experiment_id: str) -> dict:
        experiment = self.get_experiment(experiment_id)
        child = self.get_child_or_create_default(db)
        existing_progress = (
            db.query(ScienceProgress)
            .filter(
                ScienceProgress.child_id == child.id,
                ScienceProgress.experiment_id == experiment_id,
            )
            .one_or_none()
        )

        if existing_progress is not None and existing_progress.completed:
            completed_experiment_ids = self.get_completed_experiment_ids(db, child.id)
            topic_id = experiment["topic_id"]
            return {
                "experiment_id": experiment_id,
                "completed": True,
                "xp_awarded": 0,
                "total_xp": child.xp,
                "already_completed": True,
                "child": child,
                "progress": self.serialize_progress(db, child.id),
                "achievements_unlocked": [],
                "topic_completed": is_science_topic_complete(
                    topic_id,
                    completed_experiment_ids,
                ),
                "topic_id": topic_id,
                "topic_reward": None,
                "new_achievements": [],
                "completed_at": existing_progress.completed_at,
            }

        self.validate_experiment_unlocked(db, child.id, experiment_id)

        xp_awarded = get_science_experiment_xp(experiment_id)

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

        completed_experiment_ids = self.get_completed_experiment_ids(db, child.id)
        completed_experiment_ids.add(experiment_id)
        topic_id = experiment["topic_id"]
        topic = get_science_topic(topic_id)
        topic_completed = is_science_topic_complete(topic_id, completed_experiment_ids)
        topic_reward = None
        topic_achievements = []

        if topic_completed and topic is not None:
            topic_reward = self.grant_topic_reward_once(db, child.id, topic)
            if self.achievement_service is not None:
                topic_achievements = self.achievement_service.evaluate(
                    db,
                    "science_topic_completed",
                    child=child,
                    source_adventure="science",
                    metadata=topic_id,
                )

        db.commit()
        db.refresh(child)
        db.refresh(progress)

        new_achievements = [
            *achievements_unlocked,
            *topic_achievements,
        ]

        return {
            "experiment_id": experiment_id,
            "completed": True,
            "xp_awarded": xp_awarded,
            "total_xp": child.xp,
            "already_completed": False,
            "child": child,
            "progress": self.serialize_progress(db, child.id),
            "achievements_unlocked": new_achievements,
            "topic_completed": topic_completed,
            "topic_id": topic_id,
            "topic_reward": topic_reward,
            "new_achievements": new_achievements,
            "completed_at": progress.completed_at,
        }
