from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_daily_goal_service
from app.database.database import get_db
from app.schemas.daily_goal import (
    DailyGoalProgressResponse,
    DailyGoalRead,
    LearningStreakRead,
)
from app.services.daily_goal_service import DailyGoalService

router = APIRouter(tags=["daily-goals"])


@router.get("/daily-goal", response_model=DailyGoalRead)
def get_daily_goal(
    db: Session = Depends(get_db),
    daily_goal_service: DailyGoalService = Depends(get_daily_goal_service),
):
    return daily_goal_service.get_today_goal(db)


@router.post("/daily-goal/progress", response_model=DailyGoalProgressResponse)
def progress_daily_goal(
    db: Session = Depends(get_db),
    daily_goal_service: DailyGoalService = Depends(get_daily_goal_service),
):
    result = daily_goal_service.record_correct_answer(db)
    db.commit()
    db.refresh(result["daily_goal"])
    db.refresh(result["streak"])
    return result


@router.get("/daily-streak", response_model=LearningStreakRead)
def get_daily_streak(
    db: Session = Depends(get_db),
    daily_goal_service: DailyGoalService = Depends(get_daily_goal_service),
):
    return daily_goal_service.get_streak(db)
