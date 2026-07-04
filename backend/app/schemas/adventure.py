from datetime import datetime

from pydantic import BaseModel


class AdventureRead(BaseModel):
    id: str
    title: str
    description: str
    icon: str
    route: str
    status: str
    subject: str
    theme: str
    is_playable: bool
    is_coming_soon: bool
    required_regions: list[str]
    is_unlocked: bool
    is_completed: bool


class AdventureProgressRead(BaseModel):
    adventure_id: str
    title: str
    subject: str
    activities_completed: int
    correct_answers: int
    incorrect_answers: int
    xp_earned: int
    completion_percent: int
    is_unlocked: bool
    is_completed: bool
    last_activity: datetime | None = None
