from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.child import Child
from app.schemas.child import ChildRead

router = APIRouter(prefix="/child", tags=["child"])


@router.get("", response_model=ChildRead)
def get_child(db: Session = Depends(get_db)):
    child = db.query(Child).first()

    if child is None:
        child = Child(
            name="Lena",
            grade=2,
            level=1,
            xp=40,
            tree_stage="Seedling",
        )
        db.add(child)
        db.commit()
        db.refresh(child)

    return child