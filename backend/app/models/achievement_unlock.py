from sqlalchemy import Column, Integer, String, DateTime, Text, UniqueConstraint
from datetime import datetime

from app.database.database import Base


class AchievementUnlock(Base):
    __tablename__ = "achievement_unlocks"
    __table_args__ = (
        UniqueConstraint("child_id", "achievement_id", name="uq_child_achievement"),
    )

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, nullable=False, index=True)
    achievement_id = Column(String, nullable=False, index=True)
    source_adventure = Column(String, nullable=True)
    metadata_json = Column("metadata", Text, nullable=True)
    unlocked_at = Column(DateTime, default=datetime.utcnow)
