from datetime import datetime

from sqlalchemy import Boolean, Column, Date, DateTime, Integer, UniqueConstraint

from app.database.database import Base


class DailyGoal(Base):
    __tablename__ = "daily_goals"
    __table_args__ = (
        UniqueConstraint("child_id", "date", name="uq_child_daily_goal"),
    )

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    target_correct_answers = Column(Integer, nullable=False, default=10)
    current_correct_answers = Column(Integer, nullable=False, default=0)
    completed = Column(Boolean, nullable=False, default=False)
    completed_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
