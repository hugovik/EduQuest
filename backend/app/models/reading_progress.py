from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String, UniqueConstraint

from app.database.database import Base


class ReadingProgress(Base):
    __tablename__ = "reading_progress"
    __table_args__ = (
        UniqueConstraint("child_id", "passage_id", name="uq_child_reading_passage"),
    )

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, nullable=False, index=True)
    passage_id = Column(String, nullable=False, index=True)
    level = Column(Integer, nullable=False, index=True)
    questions_answered = Column(Integer, nullable=False, default=0)
    correct_answers = Column(Integer, nullable=False, default=0)
    vocabulary_learned = Column(Integer, nullable=False, default=0)
    xp_awarded = Column(Integer, nullable=False, default=0)
    completed = Column(Boolean, nullable=False, default=False)
    completed_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
