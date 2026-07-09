from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_writing_service
from app.database.database import get_db
from app.schemas.writing import WritingLessonCompletionRead, WritingProgressRead
from app.services.writing_service import WritingService

router = APIRouter(prefix="/writing", tags=["writing"])


@router.get("/progress", response_model=WritingProgressRead)
def get_writing_progress(
    db: Session = Depends(get_db),
    writing_service: WritingService = Depends(get_writing_service),
):
    return writing_service.get_progress(db)


@router.post(
    "/lessons/{lesson_id}/complete",
    response_model=WritingLessonCompletionRead,
)
def complete_writing_lesson(
    lesson_id: str,
    db: Session = Depends(get_db),
    writing_service: WritingService = Depends(get_writing_service),
):
    return writing_service.complete_lesson(db, lesson_id)
