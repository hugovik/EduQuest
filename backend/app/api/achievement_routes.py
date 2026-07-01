from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_achievement_service
from app.database.database import get_db
from app.schemas.achievement import (
    AchievementEvaluateRequest,
    AchievementEvaluateResponse,
    AchievementRead,
    AchievementUnlockRead,
)
from app.services.achievement_service import AchievementService

router = APIRouter(prefix="/achievements", tags=["achievements"])


@router.get("", response_model=list[AchievementRead])
def get_achievements(
    db: Session = Depends(get_db),
    achievement_service: AchievementService = Depends(get_achievement_service),
):
    return achievement_service.list_all(db)


@router.get("/earned", response_model=list[AchievementUnlockRead])
def get_earned_achievements(
    db: Session = Depends(get_db),
    achievement_service: AchievementService = Depends(get_achievement_service),
):
    return achievement_service.list_earned(db)


@router.post("/evaluate", response_model=AchievementEvaluateResponse)
def evaluate_achievements(
    request: AchievementEvaluateRequest,
    db: Session = Depends(get_db),
    achievement_service: AchievementService = Depends(get_achievement_service),
):
    child = achievement_service.get_child_or_create_default(db)
    newly_earned = achievement_service.evaluate(
        db,
        request.event_type,
        child=child,
        source_adventure=request.source_adventure,
        metadata=request.metadata,
    )
    db.commit()
    for achievement in newly_earned:
        db.refresh(achievement)
    return {"newly_earned": newly_earned}
