from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from app.database.database import Base


class TreeGrowthEvent(Base):
    __tablename__ = "tree_growth_events"

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, nullable=False, index=True)

    growth_type = Column(String, nullable=False)
    description = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)