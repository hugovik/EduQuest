from sqlalchemy.orm import Session

from app.models.adventure_level_preference import AdventureLevelPreference


class LearningPreferenceRepository:
    def get_by_child_and_adventure(
        self,
        db: Session,
        child_id: int,
        adventure_type: str,
    ) -> AdventureLevelPreference | None:
        return (
            db.query(AdventureLevelPreference)
            .filter(
                AdventureLevelPreference.child_id == child_id,
                AdventureLevelPreference.adventure_type == adventure_type,
            )
            .first()
        )

    def list_by_child(
        self,
        db: Session,
        child_id: int,
    ) -> list[AdventureLevelPreference]:
        return (
            db.query(AdventureLevelPreference)
            .filter(AdventureLevelPreference.child_id == child_id)
            .order_by(AdventureLevelPreference.adventure_type.asc())
            .all()
        )

    def get_or_create(
        self,
        db: Session,
        child_id: int,
        adventure_type: str,
    ) -> AdventureLevelPreference:
        preference = self.get_by_child_and_adventure(db, child_id, adventure_type)

        if preference is None:
            preference = AdventureLevelPreference(
                child_id=child_id,
                adventure_type=adventure_type,
                override_level=None,
            )
            db.add(preference)
            db.flush()

        return preference
