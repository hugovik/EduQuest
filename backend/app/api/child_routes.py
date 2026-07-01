from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_quest_service
from app.database.database import get_db
from app.schemas.child import ChildRead
from app.services.quest_service import QuestService

router = APIRouter(prefix="/child", tags=["child"])


@router.get("", response_model=ChildRead)
def get_child(
    db: Session = Depends(get_db),
    quest_service: QuestService = Depends(get_quest_service),
):
    return quest_service.get_child_or_create_default(db)
