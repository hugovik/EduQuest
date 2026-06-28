from sqlalchemy.orm import Session

from app.models.quest import Quest


class QuestRepository:
    def get_by_id(self, db: Session, quest_id: str) -> Quest | None:
        return db.query(Quest).filter(Quest.id == quest_id).first()

    def list_all(self, db: Session) -> list[Quest]:
        return db.query(Quest).all()

    def list_by_subject(self, db: Session, subject: str) -> list[Quest]:
        return db.query(Quest).filter(Quest.subject == subject).all()

    def create(self, db: Session, quest: Quest) -> Quest:
        db.add(quest)
        db.commit()
        db.refresh(quest)
        return quest