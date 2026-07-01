from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, UniqueConstraint

from app.database.database import Base


class AdventureLevelPreference(Base):
    __tablename__ = "adventure_level_preferences"
    __table_args__ = (
        UniqueConstraint(
            "child_id",
            "adventure_type",
            name="uq_child_adventure_level_preference",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, nullable=False, index=True)
    adventure_type = Column(String, nullable=False, index=True)
    override_level = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
