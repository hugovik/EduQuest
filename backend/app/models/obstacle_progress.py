from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String

from app.database.database import Base


class ObstacleProgress(Base):
    __tablename__ = "obstacle_progress"

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, nullable=False, index=True)
    obstacle_id = Column(String, nullable=False, index=True)
    current_progress = Column(Integer, nullable=False, default=0)
    required_progress = Column(Integer, nullable=False, default=20)
    completed = Column(Boolean, nullable=False, default=False)
    completion_reward_awarded = Column(Boolean, nullable=False, default=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
