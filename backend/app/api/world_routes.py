from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_world_state_service
from app.database.database import get_db
from app.schemas.world import WorldStateRead, WorldTravelRequest
from app.services.world_service import WorldService

router = APIRouter(prefix="/world", tags=["world"])


@router.get("/state", response_model=WorldStateRead)
def get_world_state(
    db: Session = Depends(get_db),
    world_state_service: WorldService = Depends(get_world_state_service),
):
    return world_state_service.get_state(db)


@router.post("/travel", response_model=WorldStateRead)
def travel_world_location(
    request: WorldTravelRequest,
    db: Session = Depends(get_db),
    world_state_service: WorldService = Depends(get_world_state_service),
):
    return world_state_service.travel(db, request.location)
