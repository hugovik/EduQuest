from sqlalchemy import Column, Integer, String

from app.database.database import Base


class WorldState(Base):
    __tablename__ = "world_states"

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, nullable=False, index=True)

    time_of_day = Column(String, nullable=False, default="morning")
    season = Column(String, nullable=False, default="summer")
    weather = Column(String, nullable=False, default="sunny")
    active_location = Column(String, nullable=False, default="treehouse")