from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field

from app.schemas.inventory import InventoryItemRead


class WorldTravelRequest(BaseModel):
    location: str = Field(..., min_length=1)


class WorldInventoryRead(BaseModel):
    bricks: int
    coins: int
    stars: int
    items: list[InventoryItemRead] = []


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
    updated_at: datetime
