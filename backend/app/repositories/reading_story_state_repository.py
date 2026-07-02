from sqlalchemy.orm import Session

from app.models.reading_story_state import ReadingStoryState


class ReadingStoryStateRepository:
    def get_by_child(self, db: Session, child_id: int) -> ReadingStoryState | None:
        return (
            db.query(ReadingStoryState)
            .filter(ReadingStoryState.child_id == child_id)
            .first()
        )

    def get_or_create(self, db: Session, child_id: int) -> ReadingStoryState:
        state = self.get_by_child(db, child_id)

        if state is None:
            state = ReadingStoryState(
                child_id=child_id,
                choices_made="{}",
                collectibles_found="[]",
                journal_entries="[]",
                characters_met="[]",
            )
            db.add(state)
            db.flush()

        return state
