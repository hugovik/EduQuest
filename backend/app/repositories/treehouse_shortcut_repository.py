from sqlalchemy.orm import Session

from app.models.treehouse_shortcut import TreehouseShortcut


class TreehouseShortcutRepository:
    def get_by_child_and_shortcut(
        self,
        db: Session,
        child_id: int,
        shortcut_id: str,
    ) -> TreehouseShortcut | None:
        return (
            db.query(TreehouseShortcut)
            .filter(
                TreehouseShortcut.child_id == child_id,
                TreehouseShortcut.shortcut_id == shortcut_id,
            )
            .first()
        )

    def get_or_create(
        self,
        db: Session,
        child_id: int,
        shortcut_id: str,
    ) -> TreehouseShortcut:
        shortcut = self.get_by_child_and_shortcut(db, child_id, shortcut_id)

        if shortcut is None:
            shortcut = TreehouseShortcut(
                child_id=child_id,
                shortcut_id=shortcut_id,
                stage=0,
                contributed_units=0,
            )
            db.add(shortcut)
            db.flush()

        return shortcut

    def list_by_child(self, db: Session, child_id: int) -> list[TreehouseShortcut]:
        return (
            db.query(TreehouseShortcut)
            .filter(TreehouseShortcut.child_id == child_id)
            .order_by(TreehouseShortcut.shortcut_id.asc())
            .all()
        )
