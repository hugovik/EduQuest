from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from app.database.database import Base


class QuestCompletion(Base):
    __tablename__ = "quest_completions"

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, nullable=False, index=True)
    quest_id = Column(String, nullable=False, index=True)

    xp_awarded = Column(Integer, nullable=False, default=0)
    completed_at = Column(DateTime, default=datetime.utcnow)