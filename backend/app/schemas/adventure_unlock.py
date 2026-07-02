from pydantic import BaseModel


class AdventureUnlockRead(BaseModel):
    unlocked: bool
    reason: str
    current: int | None = None
    required: int | None = None


class AdventureUnlockSummaryResponse(BaseModel):
    math: AdventureUnlockRead
    reading: AdventureUnlockRead
    writing: AdventureUnlockRead
    story: AdventureUnlockRead
    geography: AdventureUnlockRead
    science: AdventureUnlockRead
    music: AdventureUnlockRead
