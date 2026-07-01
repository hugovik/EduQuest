from sqlalchemy.orm import Session

from app.models.player_inventory import PlayerInventory


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
