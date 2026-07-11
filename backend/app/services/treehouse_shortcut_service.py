from datetime import datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.content.treehouse_shortcut_registry import TREEHOUSE_SHORTCUT_ORDER, TREEHOUSE_SHORTCUTS
from app.models.reading_progress import ReadingProgress
from app.repositories.child_repository import ChildRepository
from app.repositories.inventory_repository import InventoryRepository
from app.repositories.treehouse_shortcut_repository import TreehouseShortcutRepository
from app.services.inventory_service import InventoryService


class TreehouseShortcutService:
    def __init__(
        self,
        child_repository: ChildRepository,
        shortcut_repository: TreehouseShortcutRepository,
        inventory_repository: InventoryRepository,
        inventory_service: InventoryService,
    ):
        self.child_repository = child_repository
        self.shortcut_repository = shortcut_repository
        self.inventory_repository = inventory_repository
        self.inventory_service = inventory_service

    def get_child_or_create_default(self, db: Session):
        child = self.child_repository.get_first(db)

        if child is None:
            child = self.child_repository.create_default_child(db)

        return child

    def get_definition(self, shortcut_id: str) -> dict:
        definition = TREEHOUSE_SHORTCUTS.get(shortcut_id)
        if definition is None:
            raise HTTPException(status_code=404, detail="Treehouse shortcut not found.")
        return definition

    def count_completed_reading_passages(self, db: Session, child_id: int) -> int:
        return (
            db.query(ReadingProgress)
            .filter(
                ReadingProgress.child_id == child_id,
                ReadingProgress.completed.is_(True),
            )
            .count()
        )

    def get_owned_resource_quantity(self, db: Session, child_id: int, item_key: str) -> int:
        item = self.inventory_repository.get_item(db, child_id, item_key)
        return item.quantity if item is not None else 0

    def apply_eligibility_stage(self, db: Session, child_id: int, shortcut, definition: dict) -> None:
        if shortcut.stage > 0:
            return

        current_progress = self.count_completed_reading_passages(db, child_id)
        if current_progress >= definition["stages"][0]["required_progress"]:
            shortcut.stage = 1
            shortcut.updated_at = datetime.utcnow()
            db.flush()

    def serialize_shortcut(self, db: Session, child_id: int, shortcut, definition: dict) -> dict:
        stage = max(0, min(shortcut.stage, definition["maximum_stage"]))
        stage_definition = definition["stages"][stage]
        completed = stage >= definition["maximum_stage"]
        current_progress = self.count_completed_reading_passages(db, child_id)
        required_progress = stage_definition["required_progress"]
        eligible = current_progress >= definition["stages"][0]["required_progress"]
        progress_requirement_met = current_progress >= required_progress
        resource = definition["resource"]
        required_resource_quantity = stage_definition["resource_quantity"]
        owned_resource_quantity = self.get_owned_resource_quantity(db, child_id, resource["item_key"])
        can_contribute = (
            eligible
            and not completed
            and progress_requirement_met
            and required_resource_quantity > 0
            and owned_resource_quantity >= required_resource_quantity
        )

        status = "completed" if completed else "building" if stage > 1 else "eligible" if eligible else "locked"
        if completed:
            action_label = "Enter Reading Forest"
            status_message = "Shortcut complete. The bookshelf glows with forest magic."
        elif not eligible:
            action_label = "Keep Exploring"
            status_message = definition["stages"][0]["message"]
        elif not progress_requirement_met:
            action_label = "Need More Reading Progress"
            status_message = f"Complete {required_progress} Reading Forest passages to build the next stage."
        elif required_resource_quantity <= 0:
            action_label = "View Blueprint"
            status_message = stage_definition["message"]
        elif owned_resource_quantity < required_resource_quantity:
            action_label = "Need More Materials"
            status_message = f"Collect {required_resource_quantity} {resource['item_name']} to build the next stage."
        else:
            action_label = "Build Next Stage"
            status_message = stage_definition["message"]

        return {
            "shortcut_id": definition["shortcut_id"],
            "region_id": definition["region_id"],
            "display_name": definition["display_name"],
            "description": definition["description"],
            "stage": stage,
            "maximum_stage": definition["maximum_stage"],
            "completed": completed,
            "eligible": eligible,
            "status": status,
            "progress_requirement_met": progress_requirement_met,
            "current_progress": current_progress,
            "required_progress": required_progress,
            "required_resource_id": resource["item_key"],
            "required_resource_name": resource["item_name"],
            "required_resource_quantity": required_resource_quantity,
            "owned_resource_quantity": owned_resource_quantity,
            "can_contribute": can_contribute,
            "next_stage": None if completed else stage + 1,
            "status_message": status_message,
            "action_label": action_label,
            "completed_at": shortcut.completed_at,
            "display_order": definition["display_order"],
        }

    def get_shortcut(self, db: Session, shortcut_id: str) -> dict:
        definition = self.get_definition(shortcut_id)
        child = self.get_child_or_create_default(db)
        shortcut = self.shortcut_repository.get_or_create(db, child.id, shortcut_id)
        self.apply_eligibility_stage(db, child.id, shortcut, definition)
        db.commit()
        db.refresh(shortcut)
        return self.serialize_shortcut(db, child.id, shortcut, definition)

    def list_shortcuts(self, db: Session) -> list[dict]:
        child = self.get_child_or_create_default(db)
        shortcuts = []
        for shortcut_id in TREEHOUSE_SHORTCUT_ORDER:
            definition = self.get_definition(shortcut_id)
            shortcut = self.shortcut_repository.get_or_create(db, child.id, shortcut_id)
            self.apply_eligibility_stage(db, child.id, shortcut, definition)
            shortcuts.append(self.serialize_shortcut(db, child.id, shortcut, definition))
        db.commit()
        return sorted(shortcuts, key=lambda item: item["display_order"])

    def contribute(self, db: Session, shortcut_id: str) -> dict:
        definition = self.get_definition(shortcut_id)
        child = self.get_child_or_create_default(db)
        shortcut = self.shortcut_repository.get_or_create(db, child.id, shortcut_id)
        self.apply_eligibility_stage(db, child.id, shortcut, definition)
        current_state = self.serialize_shortcut(db, child.id, shortcut, definition)

        if current_state["completed"]:
            raise HTTPException(status_code=409, detail="Treehouse shortcut is already complete.")

        if not current_state["eligible"]:
            raise HTTPException(status_code=403, detail=current_state["status_message"])

        if not current_state["progress_requirement_met"]:
            raise HTTPException(status_code=403, detail=current_state["status_message"])

        if not current_state["can_contribute"]:
            raise HTTPException(status_code=400, detail=current_state["status_message"])

        self.inventory_service.consume_item(
            db,
            child.id,
            current_state["required_resource_id"],
            quantity=current_state["required_resource_quantity"],
            commit=False,
        )
        shortcut.stage += 1
        shortcut.contributed_units += current_state["required_resource_quantity"]
        shortcut.updated_at = datetime.utcnow()
        if shortcut.stage >= definition["maximum_stage"]:
            shortcut.stage = definition["maximum_stage"]
            shortcut.completed_at = shortcut.completed_at or datetime.utcnow()

        db.commit()
        db.refresh(shortcut)
        return self.serialize_shortcut(db, child.id, shortcut, definition)
