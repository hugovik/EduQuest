from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

from app.database.database import Base


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String, nullable=False, default="🏆")
    trigger_type = Column(String, nullable=False)
    trigger_threshold = Column(Integer, nullable=False, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
