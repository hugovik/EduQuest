from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_reward_service
from app.database.database import get_db
from app.schemas.inventory import (
    IncorrectAnswerResponse,
    InventoryRead,
    ObstacleProgressRead,
    RewardRequest,
    RewardResponse,
)
from app.services.reward_service import RewardService

router = APIRouter(prefix="/inventory", tags=["inventory"])


@router.get("", response_model=InventoryRead)
def get_inventory(
    db: Session = Depends(get_db),
    reward_service: RewardService = Depends(get_reward_service),
):
    return reward_service.get_inventory(db)


@router.get("/obstacles", response_model=list[ObstacleProgressRead])
def get_obstacle_progress(
    db: Session = Depends(get_db),
    reward_service: RewardService = Depends(get_reward_service),
):
    return reward_service.list_obstacle_progress(db)


@router.post("/reward", response_model=RewardResponse)
def reward_correct_answer(
    request: RewardRequest,
    db: Session = Depends(get_db),
    reward_service: RewardService = Depends(get_reward_service),
):
    return reward_service.reward_correct_answer(db, request.obstacle_id)


@router.post("/penalty", response_model=IncorrectAnswerResponse)
def apply_incorrect_answer_penalty(
    request: RewardRequest,
    db: Session = Depends(get_db),
    reward_service: RewardService = Depends(get_reward_service),
):
    return reward_service.award_incorrect_answer(db, request.obstacle_id)
