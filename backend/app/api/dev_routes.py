from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.child import Child
from app.models.progress_event import ProgressEvent
from app.models.quest_completion import QuestCompletion
from app.models.tree_growth_event import TreeGrowthEvent

router = APIRouter(prefix="/dev", tags=["dev"])


@router.post("/reset-progress")
def reset_progress(db: Session = Depends(get_db)):
    db.query(QuestCompletion).delete()
    db.query(ProgressEvent).delete()
    db.query(TreeGrowthEvent).delete()

    children = db.query(Child).all()

    for child in children:
        child.xp = 0
        child.level = 1
        child.tree_stage = "Seedling"

    db.commit()

    return {
        "status": "ok",
        "message": "Progress reset for development testing.",
        "children_reset": len(children),
    }