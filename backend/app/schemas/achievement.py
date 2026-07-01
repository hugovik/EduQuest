from datetime import datetime
from pydantic import BaseModel


class AchievementRead(BaseModel):
    id: str
    key: str | None = None
    title: str
    name: str | None = None
    description: str
    category: str | None = None
    icon: str
    xp_bonus: int = 0
    active: bool = True

    model_config = {"from_attributes": True}


class AchievementUnlockRead(BaseModel):
    id: int
    achievement_id: str
    earned_at: datetime | None = None
    unlocked_at: datetime
    source_adventure: str | None = None
    metadata: str | None = None
    achievement: AchievementRead | None = None

    model_config = {"from_attributes": True}


class AchievementEvaluateRequest(BaseModel):
    event_type: str
    source_adventure: str | None = None
    metadata: str | None = None


class AchievementEvaluateResponse(BaseModel):
    newly_earned: list[AchievementRead]
