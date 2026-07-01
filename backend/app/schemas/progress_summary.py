from pydantic import BaseModel

from app.schemas.achievement import AchievementUnlockRead
from app.schemas.child import ChildRead


class ProgressSummaryResponse(BaseModel):
    child: ChildRead
    completed_quests: int
    total_xp_awarded: int
    progress_events: int
    tree_growth_events: int
    tree_stage: str
    achievements_unlocked: int
    achievements: list[AchievementUnlockRead] = []
