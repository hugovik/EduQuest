from datetime import datetime

from pydantic import BaseModel

from app.schemas.achievement import AchievementRead
from app.schemas.child import ChildRead
from app.schemas.daily_goal import DailyGoalRead, LearningStreakRead


class InventoryRead(BaseModel):
    child_id: int
    bricks: int
    coins: int
    stars: int

    model_config = {
        "from_attributes": True
    }


class ObstacleProgressRead(BaseModel):
    child_id: int
    obstacle_id: str
    current_progress: int
    required_progress: int
    completed: bool
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }


class RewardRequest(BaseModel):
    obstacle_id: str


class RewardResponse(BaseModel):
    inventory: InventoryRead
    obstacle_progress: ObstacleProgressRead
    daily_goal: DailyGoalRead | None = None
    streak: LearningStreakRead | None = None
    daily_goal_completed_today: bool = False
    achievements_unlocked: list[AchievementRead] = []
    rewards: dict[str, int]
    events: list[str]


class IncorrectAnswerResponse(BaseModel):
    child: ChildRead
    inventory: InventoryRead
    obstacle_progress: ObstacleProgressRead
    rewards: dict[str, int]
    events: list[str]
