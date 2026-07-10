from datetime import datetime

from pydantic import BaseModel

from app.schemas.achievement import AchievementRead
from app.schemas.child import ChildRead


class ScienceExperimentRead(BaseModel):
    id: str
    title: str
    topic_id: str
    activity_type: str
    xp_reward: int
    xp: int
    order: int
    requires: str | None = None


class ScienceProgressRead(BaseModel):
    completed_experiments: list[str]
    experiments_completed: int
    total_experiments: int
    xp_earned: int
    topics: list[dict] = []


class ScienceExperimentCompletionRead(BaseModel):
    experiment_id: str
    completed: bool
    xp_awarded: int
    total_xp: int
    already_completed: bool
    child: ChildRead
    progress: ScienceProgressRead
    achievements_unlocked: list[AchievementRead] = []
    topic_completed: bool = False
    topic_id: str | None = None
    topic_reward: dict | None = None
    new_achievements: list[AchievementRead] = []
    completed_at: datetime | None = None
