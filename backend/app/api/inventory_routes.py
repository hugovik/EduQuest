from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_inventory_service, get_reward_service
from app.database.database import get_db
from app.schemas.inventory import (
    IncorrectAnswerResponse,
    InventoryConsumeRequest,
    InventoryItemRead,
    InventoryItemRequest,
    InventoryRead,
    ObstacleProgressRead,
    RewardRequest,
    RewardResponse,
)
from app.services.inventory_service import InventoryService
from app.services.reward_service import RewardService

router = APIRouter(prefix="/inventory", tags=["inventory"])


@router.get("", response_model=InventoryRead)
def get_inventory(
    db: Session = Depends(get_db),
    inventory_service: InventoryService = Depends(get_inventory_service),
):
    return inventory_service.get_inventory(db)


@router.post("/items", response_model=InventoryItemRead)
def add_inventory_item(
    request: InventoryItemRequest,
    db: Session = Depends(get_db),
    inventory_service: InventoryService = Depends(get_inventory_service),
):
    return inventory_service.add_item(
        db,
        child_id=None,
        item_key=request.item_key,
        quantity=request.quantity,
        source_region=request.source_region,
        item_name=request.item_name,
        item_type=request.item_type,
        description=request.description,
    )


@router.post("/items/consume", response_model=InventoryItemRead)
def consume_inventory_item(
    request: InventoryConsumeRequest,
    db: Session = Depends(get_db),
    inventory_service: InventoryService = Depends(get_inventory_service),
):
    return inventory_service.consume_item(
        db,
        child_id=None,
        item_key=request.item_key,
        quantity=request.quantity,
    )


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
