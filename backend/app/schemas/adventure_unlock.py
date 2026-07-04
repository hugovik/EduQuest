from pydantic import BaseModel


class AdventureUnlockRead(BaseModel):
    unlocked: bool
    is_unlocked: bool
    is_available: bool
    coming_soon: bool
    reason: str
    lock_reason: str | None = None
    unlock_requirement: str | None = None
    current: int | None = None
    required: int | None = None


class AdventureUnlockSummaryResponse(BaseModel):
    math: AdventureUnlockRead
    reading: AdventureUnlockRead
    writing: AdventureUnlockRead
    geography: AdventureUnlockRead
    science: AdventureUnlockRead
    music: AdventureUnlockRead
