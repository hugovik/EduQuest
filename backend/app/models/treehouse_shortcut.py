from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, UniqueConstraint

from app.database.database import Base


class TreehouseShortcut(Base):
    __tablename__ = "treehouse_shortcuts"
    __table_args__ = (
        UniqueConstraint("child_id", "shortcut_id", name="uq_child_treehouse_shortcut"),
    )

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, nullable=False, index=True)
    shortcut_id = Column(String, nullable=False, index=True)
    stage = Column(Integer, nullable=False, default=0)
    contributed_units = Column(Integer, nullable=False, default=0)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
