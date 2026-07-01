from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text

from app.database.database import Base


class ReadingPassage(Base):
    __tablename__ = "reading_passages"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    level = Column(Integer, nullable=False, index=True)
    text = Column(Text, nullable=False)
    estimated_reading_time = Column(String, nullable=False, default="2 min")
    vocabulary_words = Column(Text, nullable=False, default="[]")
    questions = Column(Text, nullable=False, default="[]")
    created_at = Column(DateTime, default=datetime.utcnow)
