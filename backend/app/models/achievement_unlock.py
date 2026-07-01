from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from app.database.database import Base


class AchievementUnlock(Base):
    __tablename__ = "achievement_unlocks"

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, nullable=False, index=True)
    achievement_id = Column(String, nullable=False, index=True)
    unlocked_at = Column(DateTime, default=datetime.utcnow)
