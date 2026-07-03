from datetime import datetime

from sqlalchemy.orm import Session

from app.models.player_inventory import InventoryItem, PlayerInventory


class InventoryRepository:
    def get_by_child(self, db: Session, child_id: int) -> PlayerInventory | None:
        return db.query(PlayerInventory).filter(PlayerInventory.child_id == child_id).first()

    def get_or_create(self, db: Session, child_id: int) -> PlayerInventory:
        inventory = self.get_by_child(db, child_id)

        if inventory is None:
            inventory = PlayerInventory(child_id=child_id, bricks=0, coins=0, stars=0)
            db.add(inventory)
            db.flush()

        return inventory

    def list_items(self, db: Session, child_id: int) -> list[InventoryItem]:
        return (
            db.query(InventoryItem)
            .filter(InventoryItem.child_id == child_id)
            .order_by(InventoryItem.earned_at.asc(), InventoryItem.item_name.asc())
            .all()
        )

    def get_item(self, db: Session, child_id: int, item_key: str) -> InventoryItem | None:
        return (
            db.query(InventoryItem)
            .filter(
                InventoryItem.child_id == child_id,
                InventoryItem.item_key == item_key,
            )
            .first()
        )

    def add_item(
        self,
        db: Session,
        child_id: int,
        item_key: str,
        item_name: str,
        item_type: str,
        quantity: int,
        source_region: str | None = None,
        description: str | None = None,
    ) -> InventoryItem:
        item = self.get_item(db, child_id, item_key)

        if item is None:
            item = InventoryItem(
                child_id=child_id,
                item_key=item_key,
                item_name=item_name,
                item_type=item_type,
                quantity=quantity,
                source_region=source_region,
                description=description,
                earned_at=datetime.utcnow(),
            )
            db.add(item)
            db.flush()
            return item

        item.quantity += quantity
        if source_region is not None:
            item.source_region = source_region
        if description is not None:
            item.description = description
        db.flush()
        return item
