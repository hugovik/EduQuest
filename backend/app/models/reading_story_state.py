from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, Text, UniqueConstraint

from app.database.database import Base


class ReadingStoryState(Base):
    __tablename__ = "reading_story_states"
    __table_args__ = (
        UniqueConstraint("child_id", name="uq_child_reading_story_state"),
    )

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, nullable=False, index=True)
    current_chapter_id = Column(Text, nullable=True)
    choices_made = Column(Text, nullable=False, default="{}")
    collectibles_found = Column(Text, nullable=False, default="[]")
    journal_entries = Column(Text, nullable=False, default="[]")
    characters_met = Column(Text, nullable=False, default="[]")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
