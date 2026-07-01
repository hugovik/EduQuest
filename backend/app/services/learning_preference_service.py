from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.adventure_level_preference import AdventureLevelPreference
from app.repositories.child_repository import ChildRepository
from app.repositories.learning_preference_repository import LearningPreferenceRepository

VALID_ADVENTURE_TYPES = {
    "math",
    "reading",
    "writing",
    "story",
    "geography",
    "science",
    "music",
}
MIN_OVERRIDE_LEVEL = 1
MAX_OVERRIDE_LEVEL = 5


class LearningPreferenceService:
    def __init__(
        self,
        child_repository: ChildRepository,
        learning_preference_repository: LearningPreferenceRepository,
    ):
        self.child_repository = child_repository
        self.learning_preference_repository = learning_preference_repository

    def get_child_or_create_default(self, db: Session):
        child = self.child_repository.get_first(db)

        if child is None:
            child = self.child_repository.create_default_child(db)

        return child

    def validate_adventure_type(self, adventure_type: str) -> None:
        if adventure_type not in VALID_ADVENTURE_TYPES:
            raise HTTPException(status_code=400, detail="Invalid adventure type")

    def validate_override_level(self, override_level: int | None) -> None:
        if override_level is None:
            return

        if override_level < MIN_OVERRIDE_LEVEL or override_level > MAX_OVERRIDE_LEVEL:
            raise HTTPException(status_code=422, detail="Invalid override level")

    def list_preferences(self, db: Session) -> list[AdventureLevelPreference]:
        child = self.get_child_or_create_default(db)

        for adventure_type in sorted(VALID_ADVENTURE_TYPES):
            self.learning_preference_repository.get_or_create(
                db,
                child.id,
                adventure_type,
            )

        db.commit()
        return self.learning_preference_repository.list_by_child(db, child.id)

    def get_preference(
        self,
        db: Session,
        adventure_type: str,
    ) -> AdventureLevelPreference:
        self.validate_adventure_type(adventure_type)
        child = self.get_child_or_create_default(db)
        preference = self.learning_preference_repository.get_or_create(
            db,
            child.id,
            adventure_type,
        )
        db.commit()
        db.refresh(preference)
        return preference

    def update_preference(
        self,
        db: Session,
        adventure_type: str,
        override_level: int | None,
    ) -> AdventureLevelPreference:
        self.validate_adventure_type(adventure_type)
        self.validate_override_level(override_level)
        child = self.get_child_or_create_default(db)
        preference = self.learning_preference_repository.get_or_create(
            db,
            child.id,
            adventure_type,
        )

        preference.override_level = override_level

        db.commit()
        db.refresh(preference)
        return preference
