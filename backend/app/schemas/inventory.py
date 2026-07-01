from datetime import datetime

from pydantic import BaseModel

from app.schemas.child import ChildRead


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
    rewards: dict[str, int]
    events: list[str]


class IncorrectAnswerResponse(BaseModel):
    child: ChildRead
    inventory: InventoryRead
    obstacle_progress: ObstacleProgressRead
    rewards: dict[str, int]
    events: list[str]
