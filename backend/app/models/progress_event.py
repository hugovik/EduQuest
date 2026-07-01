from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from app.database.database import Base


class ProgressEvent(Base):
    __tablename__ = "progress_events"

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, nullable=False, index=True)
    quest_completion_id = Column(Integer, nullable=True, index=True)

    event_type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)

    xp_change = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)