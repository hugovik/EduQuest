from sqlalchemy.orm import Session

from app.models.child import Child


class ChildRepository:
    def get_by_id(self, db: Session, child_id: int) -> Child | None:
        return db.query(Child).filter(Child.id == child_id).first()

    def get_first(self, db: Session) -> Child | None:
        return db.query(Child).first()

    def create_default_child(self, db: Session) -> Child:
        child = Child(
            name="Lena",
            grade=2,
            level=1,
            xp=40,
            tree_stage="Seedling",
        )
        db.add(child)
        db.commit()
        db.refresh(child)
        return child

    def add_xp(self, db: Session, child: Child, xp: int) -> Child:
        child.xp += xp
        db.commit()
        db.refresh(child)
        return child