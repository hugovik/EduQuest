from sqlalchemy import Column, Integer

from app.database.database import Base


class PlayerInventory(Base):
    __tablename__ = "player_inventories"

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, nullable=False, unique=True, index=True)
    bricks = Column(Integer, nullable=False, default=0)
    coins = Column(Integer, nullable=False, default=0)
    stars = Column(Integer, nullable=False, default=0)
