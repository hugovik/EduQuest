from sqlalchemy import Boolean, Column, Integer, String, Text, DateTime
from datetime import datetime

from app.database.database import Base


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(String, primary_key=True, index=True)
    key = Column(String, nullable=True, unique=True, index=True)
    title = Column(String, nullable=False)
    name = Column(String, nullable=True)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False, default="general")
    icon = Column(String, nullable=False, default="🏆")
    xp_bonus = Column(Integer, nullable=False, default=0)
    active = Column(Boolean, nullable=False, default=True)
    trigger_type = Column(String, nullable=False)
    trigger_threshold = Column(Integer, nullable=False, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
