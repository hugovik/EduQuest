from pydantic import BaseModel

from app.schemas.child import ChildRead


class RewardRead(BaseModel):
    xp: int


class QuestCompletionResponse(BaseModel):
    child: ChildRead
    reward: RewardRead
    events: list[str]