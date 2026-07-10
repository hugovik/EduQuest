from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_quest_service, get_xp_audit_service
from app.database.database import get_db
from app.schemas.child import ChildRead
from app.schemas.xp_audit import XPAuditRead
from app.services.quest_service import QuestService
from app.services.progression_rules import get_level_progress
from app.services.xp_audit_service import XPAuditService

router = APIRouter(prefix="/child", tags=["child"])


@router.get("", response_model=ChildRead)
def get_child(
    db: Session = Depends(get_db),
    quest_service: QuestService = Depends(get_quest_service),
):
    child = quest_service.get_child_or_create_default(db)
    level_progress = get_level_progress(child.xp)

    return {
        "id": child.id,
        "name": child.name,
        "grade": child.grade,
        "level": child.level,
        "xp": child.xp,
        "tree_stage": child.tree_stage,
        **level_progress,
    }


@router.get("/xp-audit", response_model=XPAuditRead)
def get_child_xp_audit(
    db: Session = Depends(get_db),
    xp_audit_service: XPAuditService = Depends(get_xp_audit_service),
):
    return xp_audit_service.get_audit(db)
