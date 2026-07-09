from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_science_service
from app.database.database import get_db
from app.schemas.science import (
    ScienceExperimentCompletionRead,
    ScienceExperimentRead,
    ScienceProgressRead,
)
from app.services.science_service import ScienceService

router = APIRouter(prefix="/science", tags=["science"])


@router.get("/experiments", response_model=list[ScienceExperimentRead])
def list_science_experiments(
    science_service: ScienceService = Depends(get_science_service),
):
    return science_service.list_experiments()


@router.get("/progress", response_model=ScienceProgressRead)
def get_science_progress(
    db: Session = Depends(get_db),
    science_service: ScienceService = Depends(get_science_service),
):
    return science_service.get_progress(db)


@router.post(
    "/experiments/{experiment_id}/complete",
    response_model=ScienceExperimentCompletionRead,
)
def complete_science_experiment(
    experiment_id: str,
    db: Session = Depends(get_db),
    science_service: ScienceService = Depends(get_science_service),
):
    return science_service.complete_experiment(db, experiment_id)
