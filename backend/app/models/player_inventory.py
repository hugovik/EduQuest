from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, UniqueConstraint

from app.database.database import Base


class PlayerInventory(Base):
    __tablename__ = "player_inventories"

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, nullable=False, unique=True, index=True)
    bricks = Column(Integer, nullable=False, default=0)
    coins = Column(Integer, nullable=False, default=0)
    stars = Column(Integer, nullable=False, default=0)


class InventoryItem(Base):
    __tablename__ = "inventory_items"
    __table_args__ = (
        UniqueConstraint("child_id", "item_key", name="uq_child_inventory_item"),
    )

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, nullable=False, index=True)
    item_key = Column(String, nullable=False, index=True)
    item_name = Column(String, nullable=False)
    item_type = Column(String, nullable=False, default="collectible")
    quantity = Column(Integer, nullable=False, default=0)
    source_region = Column(String, nullable=True)
    description = Column(String, nullable=True)
    earned_at = Column(DateTime, nullable=False, default=datetime.utcnow)
