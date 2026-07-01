from datetime import date, datetime

from pydantic import BaseModel


class DailyGoalRead(BaseModel):
    child_id: int
    date: date
    target_correct_answers: int
    current_correct_answers: int
    completed: bool
    completed_at: datetime | None

    model_config = {
        "from_attributes": True
    }


class LearningStreakRead(BaseModel):
    child_id: int
    current_streak_days: int
    longest_streak_days: int
    last_completed_date: date | None
    updated_at: datetime | None

    model_config = {
        "from_attributes": True
    }


class DailyGoalProgressResponse(BaseModel):
    daily_goal: DailyGoalRead
    streak: LearningStreakRead
    completed_today: bool
    events: list[str]
