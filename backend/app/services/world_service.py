import json
from datetime import datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories.child_repository import ChildRepository
from app.repositories.inventory_repository import InventoryRepository
from app.services.inventory_service import InventoryService
from app.repositories.world_state_repository import WorldStateRepository
from app.services.adventure_progress_summary_service import AdventureProgressSummaryService
from app.services.adventure_unlock_service import AdventureUnlockService
from app.services.world_quest_service import WorldQuestService

ALLOWED_WORLD_LOCATIONS = {"treehouse", "world", "math", "reading", "writing", "science", "geography", "music"}
REGION_LOCATIONS = {"math", "reading", "writing", "science", "geography", "music"}


class WorldService:
    def __init__(
        self,
        child_repository: ChildRepository,
        world_state_repository: WorldStateRepository,
        inventory_repository: InventoryRepository,
        inventory_service: InventoryService,
        progress_summary_service: AdventureProgressSummaryService,
        adventure_unlock_service: AdventureUnlockService,
        world_quest_service: WorldQuestService,
    ):
        self.child_repository = child_repository
        self.world_state_repository = world_state_repository
        self.inventory_repository = inventory_repository
        self.inventory_service = inventory_service
        self.progress_summary_service = progress_summary_service
        self.adventure_unlock_service = adventure_unlock_service
        self.world_quest_service = world_quest_service

    def get_child_or_create_default(self, db: Session):
        child = self.child_repository.get_first(db)

        if child is None:
            child = self.child_repository.create_default_child(db)

        return child

    def parse_list(self, value: str | None) -> list[str]:
        if not value:
            return []

        try:
            parsed = json.loads(value)
        except json.JSONDecodeError:
            return []

        if not isinstance(parsed, list):
            return []

        return [item for item in parsed if isinstance(item, str)]

    def get_state_model(self, db: Session, child_id: int):
        world_state = self.world_state_repository.get_by_child_id(db, child_id)

        if world_state is None:
            world_state = self.world_state_repository.create_for_child(db, child_id)

        changed = False
        if world_state.unlocked_regions is None:
            world_state.unlocked_regions = "[]"
            changed = True
        if world_state.visited_regions is None:
            world_state.visited_regions = "[]"
            changed = True
        if world_state.updated_at is None:
            world_state.updated_at = datetime.utcnow()
            changed = True
        if changed:
            db.commit()
            db.refresh(world_state)

        return world_state

    def get_unlocks(self, db: Session) -> dict:
        return self.adventure_unlock_service.get_unlocks(db)

    def get_unlocked_regions(self, unlocks: dict) -> list[str]:
        return [
            adventure_type
            for adventure_type, unlock in unlocks.items()
            if isinstance(unlock, dict) and unlock.get("unlocked") is True
        ]

    def get_locked_regions(self, unlocks: dict) -> list[str]:
        return [
            adventure_type
            for adventure_type, unlock in unlocks.items()
            if isinstance(unlock, dict) and unlock.get("unlocked") is not True
        ]

    def get_region(self, db: Session, location: str) -> dict | None:
        regions = self.adventure_unlock_service.get_regions(db)
        return next(
            (region for region in regions if region["region_key"] == location),
            None,
        )

    def serialize(self, db: Session, world_state, child) -> dict:
        unlocks = self.get_unlocks(db)
        regions = self.adventure_unlock_service.get_regions(db)
        unlocked_regions = self.get_unlocked_regions(unlocks)
        inventory = self.inventory_service.get_inventory(db, child.id)
        progress_summary = self.progress_summary_service.get_summary(db)
        visited_regions = self.parse_list(world_state.visited_regions)
        overarching_quest = self.world_quest_service.evaluate_restore_quest(
            db,
            child,
            visited_regions,
            progress_summary,
        )

        world_state.unlocked_regions = json.dumps(unlocked_regions)
        if world_state.updated_at is None:
            world_state.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(world_state)
        inventory = self.inventory_service.get_inventory(db, child.id)

        return {
            "active_location": world_state.active_location,
            "last_region": world_state.last_region,
            "visited_regions": visited_regions,
            "available_regions": list(ALLOWED_WORLD_LOCATIONS),
            "unlocked_regions": unlocked_regions,
            "locked_regions": self.get_locked_regions(unlocks),
            "inventory": inventory,
            "progress_summary": progress_summary,
            "unlocks": unlocks,
            "regions": regions,
            "overarching_quest": overarching_quest,
            "quest_steps": overarching_quest["steps"],
            "quest_progress_percent": overarching_quest["progress_percent"],
            "quest_status": overarching_quest["status"],
            "updated_at": world_state.updated_at,
        }

    def get_state(self, db: Session) -> dict:
        child = self.get_child_or_create_default(db)
        world_state = self.get_state_model(db, child.id)
        return self.serialize(db, world_state, child)

    def get_progress_summary(self, db: Session) -> dict:
        state = self.get_state(db)
        adventure_regions = [
            region for region in state["regions"]
            if region["region_key"] not in {"treehouse", "world"}
        ]
        inventory_items = state["inventory"].get("items", [])
        inventory_count = sum(item.get("quantity", 0) for item in inventory_items)

        return {
            "active_location": state["active_location"],
            "last_region": state["last_region"],
            "visited_regions": state["visited_regions"],
            "total_regions": len(adventure_regions),
            "unlocked_regions": len([
                region for region in adventure_regions
                if region.get("is_unlocked") is True and region.get("is_available") is True
            ]),
            "completed_regions": len([
                region for region in adventure_regions
                if region.get("progress", {}).get("status") == "completed"
            ]),
            "world_quest": {
                "title": state["overarching_quest"]["title"],
                "progress_percent": state["overarching_quest"]["progress_percent"],
                "status": state["overarching_quest"]["status"],
            },
            "inventory_count": inventory_count,
            "math": state["progress_summary"].get("math", {}),
            "reading": state["progress_summary"].get("reading", {}),
            "writing": state["progress_summary"].get("writing", {}),
            "science": state["progress_summary"].get("science", {}),
        }

    def validate_location(self, location: str):
        if location not in ALLOWED_WORLD_LOCATIONS:
            raise HTTPException(status_code=400, detail="Invalid world location.")

    def validate_unlocked(self, db: Session, location: str):
        if location not in REGION_LOCATIONS:
            return

        region = self.get_region(db, location)

        if region is None:
            raise HTTPException(status_code=400, detail="Invalid world location.")

        if region.get("coming_soon") is True:
            raise HTTPException(status_code=403, detail=region["lock_reason"])

        if region.get("is_unlocked") is not True or region.get("is_available") is not True:
            raise HTTPException(
                status_code=403,
                detail=region.get("unlock_requirement") or region.get("lock_reason") or "This region is not unlocked yet.",
            )

    def travel(self, db: Session, location: str) -> dict:
        self.validate_location(location)
        self.validate_unlocked(db, location)

        child = self.get_child_or_create_default(db)
        world_state = self.get_state_model(db, child.id)
        visited_regions = self.parse_list(world_state.visited_regions)

        world_state.active_location = location

        if location in REGION_LOCATIONS:
            world_state.last_region = location
            if location not in visited_regions:
                visited_regions.append(location)
            world_state.visited_regions = json.dumps(visited_regions)

        world_state.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(world_state)

        return self.serialize(db, world_state, child)
