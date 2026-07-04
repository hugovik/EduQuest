from datetime import datetime

from pydantic import BaseModel


class WorldQuestStepRead(BaseModel):
    key: str
    title: str
    description: str
    region: str
    status: str


class WorldQuestRewardItemRead(BaseModel):
    item_key: str
    item_name: str
    item_type: str
    description: str


class WorldQuestRead(BaseModel):
    quest_key: str
    title: str
    description: str
    status: str
    steps: list[WorldQuestStepRead]
    completed_steps: list[str]
    required_regions: list[str]
    reward_items: list[WorldQuestRewardItemRead]
    reward_xp: int
    progress_percent: int
    completed_at: datetime | None = None
