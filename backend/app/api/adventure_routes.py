from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import (
    get_adventure_service,
    get_adventure_progress_summary_service,
    get_adventure_unlock_service,
)
from app.database.database import get_db
from app.schemas.adventure import AdventureProgressRead, AdventureRead
from app.schemas.adventure_progress import AdventureProgressSummaryResponse
from app.schemas.adventure_unlock import AdventureUnlockSummaryResponse
from app.services.adventure_service import AdventureService
from app.services.adventure_progress_summary_service import AdventureProgressSummaryService
from app.services.adventure_unlock_service import AdventureUnlockService

router = APIRouter(prefix="/adventures", tags=["adventures"])


@router.get("/progress/summary", response_model=AdventureProgressSummaryResponse)
def get_adventure_progress_summary(
    db: Session = Depends(get_db),
    adventure_progress_summary_service: AdventureProgressSummaryService = Depends(
        get_adventure_progress_summary_service
    ),
):
    return adventure_progress_summary_service.get_summary(db)


@router.get("/unlocks", response_model=AdventureUnlockSummaryResponse)
def get_adventure_unlocks(
    db: Session = Depends(get_db),
    adventure_unlock_service: AdventureUnlockService = Depends(
        get_adventure_unlock_service
    ),
):
    return adventure_unlock_service.get_unlocks(db)


@router.get("", response_model=list[AdventureRead])
def get_adventures(
    db: Session = Depends(get_db),
    adventure_service: AdventureService = Depends(get_adventure_service),
):
    return adventure_service.get_adventures(db)


@router.get("/{adventure_id}/progress", response_model=AdventureProgressRead)
def get_adventure_progress(
    adventure_id: str,
    db: Session = Depends(get_db),
    adventure_service: AdventureService = Depends(get_adventure_service),
):
    progress = adventure_service.get_adventure_progress(db, adventure_id)

    if progress is None:
        raise HTTPException(status_code=404, detail="Adventure not found")

    return progress


@router.get("/{adventure_id}", response_model=AdventureRead)
def get_adventure(
    adventure_id: str,
    db: Session = Depends(get_db),
    adventure_service: AdventureService = Depends(get_adventure_service),
):
    adventure = adventure_service.get_adventure(db, adventure_id)

    if adventure is None:
        raise HTTPException(status_code=404, detail="Adventure not found")

    return adventure
