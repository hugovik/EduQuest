from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_reading_service
from app.database.database import get_db
from app.schemas.reading import (
    ReadingPassageRead,
    ReadingProgressRead,
    ReadingSubmitRequest,
    ReadingSubmitResponse,
)
from app.services.reading_service import ReadingService

router = APIRouter(prefix="/reading", tags=["reading"])


@router.get("/passages", response_model=list[ReadingPassageRead])
def get_reading_passages(
    level: int = Query(2, ge=1, le=5),
    db: Session = Depends(get_db),
    reading_service: ReadingService = Depends(get_reading_service),
):
    return reading_service.list_passages(db, level)


@router.get("/passages/{passage_id}", response_model=ReadingPassageRead)
def get_reading_passage(
    passage_id: str,
    db: Session = Depends(get_db),
    reading_service: ReadingService = Depends(get_reading_service),
):
    return reading_service.serialize_passage(reading_service.get_passage(db, passage_id))


@router.get("/progress", response_model=list[ReadingProgressRead])
def get_reading_progress(
    db: Session = Depends(get_db),
    reading_service: ReadingService = Depends(get_reading_service),
):
    return reading_service.get_progress(db)


@router.post("/passages/{passage_id}/submit", response_model=ReadingSubmitResponse)
def submit_reading_answers(
    passage_id: str,
    request: ReadingSubmitRequest,
    db: Session = Depends(get_db),
    reading_service: ReadingService = Depends(get_reading_service),
):
    return reading_service.submit_answers(db, passage_id, request.answers)
