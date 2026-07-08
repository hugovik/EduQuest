from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String, UniqueConstraint

from app.database.database import Base


class ScienceProgress(Base):
    __tablename__ = "science_progress"
    __table_args__ = (
        UniqueConstraint("child_id", "experiment_id", name="uq_child_science_experiment"),
    )

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, nullable=False, index=True)
    experiment_id = Column(String, nullable=False, index=True)
    xp_awarded = Column(Integer, nullable=False, default=0)
    completed = Column(Boolean, nullable=False, default=False)
    completed_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
