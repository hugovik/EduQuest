from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text

from app.database.database import Base


class ScienceReviewAttempt(Base):
    __tablename__ = "science_review_attempts"

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, nullable=False, index=True)
    topic_id = Column(String, nullable=False, index=True)
    score = Column(Integer, nullable=False, default=0)
    total_questions = Column(Integer, nullable=False, default=0)
    percentage = Column(Integer, nullable=False, default=0)
    mastery_level = Column(String, nullable=False, default="beginning")
    answers_json = Column(Text, nullable=False, default="[]")
    results_json = Column(Text, nullable=False, default="[]")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
