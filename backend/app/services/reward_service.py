from sqlalchemy.orm import Session

from app.models.obstacle_progress import ObstacleProgress
from app.models.player_inventory import PlayerInventory
from app.repositories.child_repository import ChildRepository
from app.repositories.inventory_repository import InventoryRepository
from app.repositories.obstacle_progress_repository import ObstacleProgressRepository
from app.services.progression_rules import (
    calculate_level_from_xp,
    calculate_tree_stage_from_xp,
)

CORRECT_ANSWER_XP = 0
INCORRECT_ANSWER_XP_PENALTY = -2
CORRECT_ANSWER_BRICKS = 1
OBSTACLE_COMPLETION_COINS = 10

OBSTACLE_REQUIREMENTS = {
    "broken-bridge-001": 20,
    "rockfall-001": 20,
}
DEFAULT_REQUIRED_PROGRESS = 20


class RewardService:
    def __init__(
        self,
        child_repository: ChildRepository,
        inventory_repository: InventoryRepository,
        obstacle_progress_repository: ObstacleProgressRepository,
    ):
        self.child_repository = child_repository
        self.inventory_repository = inventory_repository
        self.obstacle_progress_repository = obstacle_progress_repository

    def get_child_or_create_default(self, db: Session):
        child = self.child_repository.get_first(db)

        if child is None:
            child = self.child_repository.create_default_child(db)

        return child

    def get_required_progress(self, obstacle_id: str) -> int:
        return OBSTACLE_REQUIREMENTS.get(obstacle_id, DEFAULT_REQUIRED_PROGRESS)

    def get_inventory(self, db: Session) -> PlayerInventory:
        child = self.get_child_or_create_default(db)
        inventory = self.inventory_repository.get_or_create(db, child.id)
        db.commit()
        db.refresh(inventory)
        return inventory

    def list_obstacle_progress(self, db: Session) -> list[ObstacleProgress]:
        child = self.get_child_or_create_default(db)

        for obstacle_id, required_progress in OBSTACLE_REQUIREMENTS.items():
            self.obstacle_progress_repository.get_or_create(
                db,
                child.id,
                obstacle_id,
                required_progress,
            )

        db.commit()
        return self.obstacle_progress_repository.list_by_child(db, child.id)

    def reward_correct_answer(self, db: Session, obstacle_id: str) -> dict:
        child = self.get_child_or_create_default(db)
        inventory = self.inventory_repository.get_or_create(db, child.id)
        obstacle_progress = self.obstacle_progress_repository.get_or_create(
            db,
            child.id,
            obstacle_id,
            self.get_required_progress(obstacle_id),
        )

        rewards = {"xp": CORRECT_ANSWER_XP, "bricks": 0, "coins": 0, "stars": 0}
        events = []

        if obstacle_progress.completed:
            db.commit()
            db.refresh(inventory)
            db.refresh(obstacle_progress)
            return {
                "inventory": inventory,
                "obstacle_progress": obstacle_progress,
                "rewards": rewards,
                "events": events,
            }

        inventory.bricks += CORRECT_ANSWER_BRICKS
        rewards["bricks"] = CORRECT_ANSWER_BRICKS
        events.append("Brick Earned")

        bricks_to_apply = min(
            inventory.bricks,
            obstacle_progress.required_progress - obstacle_progress.current_progress,
        )

        if bricks_to_apply > 0:
            inventory.bricks -= bricks_to_apply
            obstacle_progress.current_progress += bricks_to_apply
            events.append("Brick Applied")

        if obstacle_progress.current_progress >= obstacle_progress.required_progress:
            obstacle_progress.current_progress = obstacle_progress.required_progress
            obstacle_progress.completed = True
            events.append("Obstacle Repaired")

            if not obstacle_progress.completion_reward_awarded:
                inventory.coins += OBSTACLE_COMPLETION_COINS
                obstacle_progress.completion_reward_awarded = True
                rewards["coins"] = OBSTACLE_COMPLETION_COINS
                events.append("Coins Awarded")

        db.commit()
        db.refresh(inventory)
        db.refresh(obstacle_progress)

        return {
            "inventory": inventory,
            "obstacle_progress": obstacle_progress,
            "rewards": rewards,
            "events": events,
        }

    def award_incorrect_answer(self, db: Session, obstacle_id: str) -> dict:
        child = self.get_child_or_create_default(db)
        inventory = self.inventory_repository.get_or_create(db, child.id)
        obstacle_progress = self.obstacle_progress_repository.get_or_create(
            db,
            child.id,
            obstacle_id,
            self.get_required_progress(obstacle_id),
        )

        previous_xp = child.xp
        child.xp = max(0, child.xp + INCORRECT_ANSWER_XP_PENALTY)
        child.level = max(1, calculate_level_from_xp(child.xp))
        child.tree_stage = calculate_tree_stage_from_xp(child.xp)
        applied_penalty = child.xp - previous_xp

        db.commit()
        db.refresh(child)
        db.refresh(inventory)
        db.refresh(obstacle_progress)

        return {
            "child": child,
            "inventory": inventory,
            "obstacle_progress": obstacle_progress,
            "rewards": {
                "xp": applied_penalty,
                "bricks": 0,
                "coins": 0,
                "stars": 0,
            },
            "events": ["Answer Streak Broken"],
        }
