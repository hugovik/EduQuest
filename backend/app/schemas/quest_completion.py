from pydantic import BaseModel

from app.schemas.achievement import AchievementRead
from app.schemas.child import ChildRead


class RewardRead(BaseModel):
    xp: int


class QuestCompletionResponse(BaseModel):
    child: ChildRead
    reward: RewardRead
    events: list[str]
    quest_completion_id: int
    achievements_unlocked: list[AchievementRead] = []
