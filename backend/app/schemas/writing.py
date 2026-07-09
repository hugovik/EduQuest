from datetime import datetime

from pydantic import BaseModel

from app.schemas.achievement import AchievementRead
from app.schemas.child import ChildRead


class WritingProgressRead(BaseModel):
    completed_lessons: list[str]
    lessons_completed: int
    total_lessons: int
    xp_earned: int


class WritingLessonCompletionRead(BaseModel):
    lesson_id: str
    completed: bool
    already_completed: bool
    xp_awarded: int
    total_xp: int
    child: ChildRead
    progress: WritingProgressRead
    achievements_unlocked: list[AchievementRead] = []
    completed_at: datetime | None = None
