from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_treehouse_shortcut_service
from app.database.database import get_db
from app.schemas.treehouse_shortcut import TreehouseShortcutListRead, TreehouseShortcutRead
from app.services.treehouse_shortcut_service import TreehouseShortcutService

router = APIRouter(prefix="/treehouse", tags=["treehouse"])


@router.get("/shortcuts", response_model=TreehouseShortcutListRead)
def get_treehouse_shortcuts(
    db: Session = Depends(get_db),
    shortcut_service: TreehouseShortcutService = Depends(get_treehouse_shortcut_service),
):
    return {"shortcuts": shortcut_service.list_shortcuts(db)}


@router.get("/shortcuts/{shortcut_id}", response_model=TreehouseShortcutRead)
def get_treehouse_shortcut(
    shortcut_id: str,
    db: Session = Depends(get_db),
    shortcut_service: TreehouseShortcutService = Depends(get_treehouse_shortcut_service),
):
    return shortcut_service.get_shortcut(db, shortcut_id)


@router.post("/shortcuts/{shortcut_id}/contribute", response_model=TreehouseShortcutRead)
def contribute_to_treehouse_shortcut(
    shortcut_id: str,
    db: Session = Depends(get_db),
    shortcut_service: TreehouseShortcutService = Depends(get_treehouse_shortcut_service),
):
    return shortcut_service.contribute(db, shortcut_id)
