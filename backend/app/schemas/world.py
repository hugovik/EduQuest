from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field

from app.schemas.inventory import InventoryItemRead
from app.schemas.world_quest import WorldQuestRead, WorldQuestStepRead


class WorldTravelRequest(BaseModel):
    location: str = Field(..., min_length=1)


class WorldInventoryRead(BaseModel):
    bricks: int
    coins: int
    stars: int
    items: list[InventoryItemRead] = []


class WorldRegionRead(BaseModel):
    region_key: str
    title: str
    adventure_type: str
    status: str
    is_unlocked: bool
    is_available: bool
    lock_reason: str | None = None
    unlock_requirement: str | None = None
    coming_soon: bool
    progress: dict[str, Any] = {}


class WorldStateRead(BaseModel):
    active_location: str
    last_region: str | None = None
    visited_regions: list[str]
    available_regions: list[str]
    unlocked_regions: list[str]
    locked_regions: list[str]
    inventory: WorldInventoryRead
    progress_summary: dict[str, Any]
    unlocks: dict[str, Any]
    regions: list[WorldRegionRead]
    overarching_quest: WorldQuestRead
    quest_steps: list[WorldQuestStepRead]
    quest_progress_percent: int
    quest_status: str
    updated_at: datetime
