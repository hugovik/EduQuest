from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.achievement import AchievementRead
from app.schemas.child import ChildRead
from app.schemas.daily_goal import DailyGoalRead, LearningStreakRead


class InventoryItemRead(BaseModel):
    item_key: str
    item_name: str
    item_type: str
    quantity: int
    source_region: str | None = None
    description: str | None = None
    earned_at: datetime


class InventoryRead(BaseModel):
    child_id: int
    bricks: int
    coins: int
    stars: int
    items: list[InventoryItemRead] = []

    model_config = {
        "from_attributes": True
    }


class InventoryItemRequest(BaseModel):
    item_key: str = Field(..., min_length=1)
    quantity: int = 1
    source_region: str | None = None
    item_name: str | None = None
    item_type: str | None = None
    description: str | None = None


class InventoryConsumeRequest(BaseModel):
    item_key: str = Field(..., min_length=1)
    quantity: int = 1


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
