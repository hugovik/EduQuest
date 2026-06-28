from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.quest import Quest
from app.schemas.quest import QuestRead

router = APIRouter(prefix="/quests", tags=["quests"])


def seed_first_quest(db: Session):
    existing = db.query(Quest).filter(Quest.id == "reading-forest-001").first()

    if existing:
        return

    quest = Quest(
        id="reading-forest-001",
        title="Professor Owl and the Lost Page",
        realm="Reading Forest",
        subject="reading",
        passage=(
            "Professor Owl found a lost page near the library tree. "
            "Lena helped him read the clues and return the page to the magic book."
        ),
        question="Who found the lost page?",
        answer="Professor Owl",
        xp_reward=25,
    )

    db.add(quest)
    db.commit()


@router.get("", response_model=list[QuestRead])
def get_quests(db: Session = Depends(get_db)):
    seed_first_quest(db)
    return db.query(Quest).all()