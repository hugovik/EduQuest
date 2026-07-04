from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories.child_repository import ChildRepository
from app.repositories.inventory_repository import InventoryRepository

ITEM_CATALOG = {
    "mountain_brick": {
        "item_name": "Mountain Brick",
        "item_type": "material",
        "description": "A sturdy brick earned by repairing Math Mountains paths.",
    },
    "math_crystal": {
        "item_name": "Math Crystal",
        "item_type": "treasure",
        "description": "A bright crystal that glows after number challenges.",
    },
    "reading_leaf": {
        "item_name": "Reading Leaf",
        "item_type": "collectible",
        "description": "A leaf bookmark from Reading Forest.",
    },
    "forest_gem": {
        "item_name": "Forest Gem",
        "item_type": "treasure",
        "description": "A gem found by finishing Reading Forest chapters.",
    },
    "story_key": {
        "item_name": "Story Key",
        "item_type": "key",
        "description": "A key for future story paths.",
    },
    "world_heart": {
        "item_name": "World Heart",
        "item_type": "artifact",
        "description": "A glowing crystal that restores magic to EduQuest.",
    },
}


class InventoryService:
    def __init__(
        self,
        child_repository: ChildRepository,
        inventory_repository: InventoryRepository,
    ):
        self.child_repository = child_repository
        self.inventory_repository = inventory_repository

    def get_child_or_create_default(self, db: Session):
        child = self.child_repository.get_first(db)

        if child is None:
            child = self.child_repository.create_default_child(db)

        return child

    def serialize_item(self, item) -> dict:
        return {
            "item_key": item.item_key,
            "item_name": item.item_name,
            "item_type": item.item_type,
            "quantity": item.quantity,
            "source_region": item.source_region,
            "description": item.description,
            "earned_at": item.earned_at,
        }

    def serialize_inventory(self, inventory, items) -> dict:
        return {
            "child_id": inventory.child_id,
            "bricks": inventory.bricks,
            "coins": inventory.coins,
            "stars": inventory.stars,
            "items": [self.serialize_item(item) for item in items if item.quantity > 0],
        }

    def get_inventory(self, db: Session, child_id: int | None = None) -> dict:
        child = self.get_child_or_create_default(db) if child_id is None else self.child_repository.get_by_id(db, child_id)

        if child is None:
            raise HTTPException(status_code=404, detail="Child profile not found.")

        inventory = self.inventory_repository.get_or_create(db, child.id)
        items = self.inventory_repository.list_items(db, child.id)
        db.commit()
        db.refresh(inventory)
        return self.serialize_inventory(inventory, items)

    def get_item_metadata(
        self,
        item_key: str,
        item_name: str | None = None,
        item_type: str | None = None,
        description: str | None = None,
    ) -> dict:
        catalog_item = ITEM_CATALOG.get(item_key, {})
        return {
            "item_name": item_name or catalog_item.get("item_name") or item_key.replace("_", " ").title(),
            "item_type": item_type or catalog_item.get("item_type") or "collectible",
            "description": description if description is not None else catalog_item.get("description"),
        }

    def add_item(
        self,
        db: Session,
        child_id: int | None,
        item_key: str,
        quantity: int = 1,
        source_region: str | None = None,
        item_name: str | None = None,
        item_type: str | None = None,
        description: str | None = None,
        commit: bool = True,
    ) -> dict:
        if quantity <= 0:
            raise HTTPException(status_code=422, detail="Quantity must be greater than zero.")

        child = self.get_child_or_create_default(db) if child_id is None else self.child_repository.get_by_id(db, child_id)

        if child is None:
            raise HTTPException(status_code=404, detail="Child profile not found.")

        metadata = self.get_item_metadata(item_key, item_name, item_type, description)
        item = self.inventory_repository.add_item(
            db,
            child.id,
            item_key,
            metadata["item_name"],
            metadata["item_type"],
            quantity,
            source_region,
            metadata["description"],
        )
        if commit:
            db.commit()
            db.refresh(item)
        return self.serialize_item(item)

    def add_item_once(
        self,
        db: Session,
        child_id: int,
        item_key: str,
        source_region: str | None = None,
        commit: bool = True,
    ) -> dict | None:
        if self.inventory_repository.get_item(db, child_id, item_key) is not None:
            return None

        return self.add_item(
            db,
            child_id,
            item_key,
            quantity=1,
            source_region=source_region,
            commit=commit,
        )

    def has_item(self, db: Session, child_id: int, item_key: str) -> bool:
        item = self.inventory_repository.get_item(db, child_id, item_key)
        return item is not None and item.quantity > 0

    def consume_item(
        self,
        db: Session,
        child_id: int | None,
        item_key: str,
        quantity: int = 1,
    ) -> dict:
        if quantity <= 0:
            raise HTTPException(status_code=422, detail="Quantity must be greater than zero.")

        child = self.get_child_or_create_default(db) if child_id is None else self.child_repository.get_by_id(db, child_id)

        if child is None:
            raise HTTPException(status_code=404, detail="Child profile not found.")

        item = self.inventory_repository.get_item(db, child.id, item_key)

        if item is None or item.quantity < quantity:
            raise HTTPException(status_code=400, detail="Not enough inventory items.")

        item.quantity -= quantity
        db.commit()
        db.refresh(item)
        return self.serialize_item(item)
