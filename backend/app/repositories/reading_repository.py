from sqlalchemy.orm import Session

from app.models.reading_passage import ReadingPassage
from app.models.reading_progress import ReadingProgress


class ReadingPassageRepository:
    def get_by_id(self, db: Session, passage_id: str) -> ReadingPassage | None:
        return db.query(ReadingPassage).filter(ReadingPassage.id == passage_id).first()

    def list_by_level(self, db: Session, level: int) -> list[ReadingPassage]:
        return (
            db.query(ReadingPassage)
            .filter(ReadingPassage.level == level)
            .order_by(ReadingPassage.id.asc())
            .all()
        )

    def create(self, db: Session, passage: ReadingPassage) -> ReadingPassage:
        db.add(passage)
        return passage

    def count_by_level(self, db: Session, level: int | None = None) -> int:
        query = db.query(ReadingPassage)
        if level is not None:
            query = query.filter(ReadingPassage.level == level)
        return query.count()


class ReadingProgressRepository:
    def get_by_child_and_passage(
        self,
        db: Session,
        child_id: int,
        passage_id: str,
    ) -> ReadingProgress | None:
        return (
            db.query(ReadingProgress)
            .filter(
                ReadingProgress.child_id == child_id,
                ReadingProgress.passage_id == passage_id,
            )
            .first()
        )

    def list_by_child(self, db: Session, child_id: int) -> list[ReadingProgress]:
        return (
            db.query(ReadingProgress)
            .filter(ReadingProgress.child_id == child_id)
            .order_by(ReadingProgress.updated_at.desc())
            .all()
        )

    def create(self, db: Session, progress: ReadingProgress) -> ReadingProgress:
        db.add(progress)
        return progress

    def count_completed_by_child(self, db: Session, child_id: int) -> int:
        return (
            db.query(ReadingProgress)
            .filter(ReadingProgress.child_id == child_id, ReadingProgress.completed.is_(True))
            .count()
        )

    def total_xp_by_child(self, db: Session, child_id: int) -> int:
        from sqlalchemy import func

        return (
            db.query(func.coalesce(func.sum(ReadingProgress.xp_awarded), 0))
            .filter(ReadingProgress.child_id == child_id)
            .scalar()
        )
