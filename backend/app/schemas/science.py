from datetime import datetime

from pydantic import BaseModel

from app.schemas.achievement import AchievementRead
from app.schemas.child import ChildRead


class ScienceExperimentRead(BaseModel):
    id: str
    title: str
    xp: int


class ScienceProgressRead(BaseModel):
    completed_experiments: list[str]
    experiments_completed: int
    total_experiments: int
    xp_earned: int


class ScienceExperimentCompletionRead(BaseModel):
    experiment_id: str
    completed: bool
    xp_awarded: int
    total_xp: int
    already_completed: bool
    child: ChildRead
    progress: ScienceProgressRead
    achievements_unlocked: list[AchievementRead] = []
    completed_at: datetime | None = None
