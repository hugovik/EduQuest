from sqlalchemy import Column, Integer, String, Text

from app.database.database import Base


class Quest(Base):
    __tablename__ = "quests"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    realm = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    passage = Column(Text, nullable=True)
    question = Column(Text, nullable=True)
    answer = Column(String, nullable=True)
    xp_reward = Column(Integer, nullable=False, default=10)