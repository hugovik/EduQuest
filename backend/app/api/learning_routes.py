from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_learning_preference_service
from app.database.database import get_db
from app.schemas.learning_preference import (
    LearningPreferenceRead,
    LearningPreferenceUpdate,
)
from app.services.learning_preference_service import LearningPreferenceService

router = APIRouter(prefix="/learning", tags=["learning"])


@router.get("/preferences", response_model=list[LearningPreferenceRead])
def get_learning_preferences(
    db: Session = Depends(get_db),
    learning_preference_service: LearningPreferenceService = Depends(
        get_learning_preference_service
    ),
):
    return learning_preference_service.list_preferences(db)


@router.get("/preferences/{adventure_type}", response_model=LearningPreferenceRead)
def get_learning_preference(
    adventure_type: str,
    db: Session = Depends(get_db),
    learning_preference_service: LearningPreferenceService = Depends(
        get_learning_preference_service
    ),
):
    return learning_preference_service.get_preference(db, adventure_type)


@router.put("/preferences/{adventure_type}", response_model=LearningPreferenceRead)
def update_learning_preference(
    adventure_type: str,
    request: LearningPreferenceUpdate,
    db: Session = Depends(get_db),
    learning_preference_service: LearningPreferenceService = Depends(
        get_learning_preference_service
    ),
):
    return learning_preference_service.update_preference(
        db,
        adventure_type,
        request.override_level,
    )
