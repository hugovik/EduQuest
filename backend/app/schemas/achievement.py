from datetime import datetime
from pydantic import BaseModel


class AchievementRead(BaseModel):
    id: str
    title: str
    description: str
    icon: str

    model_config = {"from_attributes": True}


class AchievementUnlockRead(BaseModel):
    id: int
    achievement_id: str
    unlocked_at: datetime
    achievement: AchievementRead | None = None

    model_config = {"from_attributes": True}
