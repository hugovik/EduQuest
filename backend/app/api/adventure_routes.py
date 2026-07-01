from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_adventure_progress_summary_service
from app.database.database import get_db
from app.schemas.adventure_progress import AdventureProgressSummaryResponse
from app.services.adventure_progress_summary_service import (
    AdventureProgressSummaryService,
)

router = APIRouter(prefix="/adventures", tags=["adventures"])


@router.get("/progress/summary", response_model=AdventureProgressSummaryResponse)
def get_adventure_progress_summary(
    db: Session = Depends(get_db),
    adventure_progress_summary_service: AdventureProgressSummaryService = Depends(
        get_adventure_progress_summary_service
    ),
):
    return adventure_progress_summary_service.get_summary(db)
