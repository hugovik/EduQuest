from datetime import datetime

from sqlalchemy import Column, Date, DateTime, Integer

from app.database.database import Base


class LearningStreak(Base):
    __tablename__ = "learning_streaks"

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, nullable=False, unique=True, index=True)
    current_streak_days = Column(Integer, nullable=False, default=0)
    longest_streak_days = Column(Integer, nullable=False, default=0)
    last_completed_date = Column(Date, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
