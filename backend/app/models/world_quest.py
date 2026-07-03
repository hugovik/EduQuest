from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text, UniqueConstraint

from app.database.database import Base


class WorldQuest(Base):
    __tablename__ = "world_quests"
    __table_args__ = (
        UniqueConstraint("child_id", "quest_key", name="uq_child_world_quest"),
    )

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, nullable=False, index=True)
    quest_key = Column(String, nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String, nullable=False, default="not_started")
    steps = Column(Text, nullable=False, default="[]")
    completed_steps = Column(Text, nullable=False, default="[]")
    required_regions = Column(Text, nullable=False, default="[]")
    reward_items = Column(Text, nullable=False, default="[]")
    reward_xp = Column(Integer, nullable=False, default=0)
    completed_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
