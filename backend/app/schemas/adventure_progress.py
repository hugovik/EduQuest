from pydantic import BaseModel


class AdventureProgressRead(BaseModel):
    completed_quests: int
    total_quests: int
    xp_earned: int
    level: int
    status: str


class AdventureProgressSummaryResponse(BaseModel):
    math: AdventureProgressRead
    reading: AdventureProgressRead
    writing: AdventureProgressRead
    story: AdventureProgressRead
    geography: AdventureProgressRead
    science: AdventureProgressRead
    music: AdventureProgressRead
