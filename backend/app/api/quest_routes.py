from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_quest_service
from app.database.database import get_db
from app.models.quest import Quest
from app.schemas.quest import QuestRead
from app.schemas.quest_completion import QuestCompletionResponse
from app.services.quest_service import QuestService

router = APIRouter(prefix="/quests", tags=["quests"])


def seed_first_quest(db: Session, quest_service: QuestService):
    existing = quest_service.get_quest(db, "reading-forest-001")

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

    quest_service.quest_repository.create(db, quest)


@router.get("", response_model=list[QuestRead])
def get_quests(
    db: Session = Depends(get_db),
    quest_service: QuestService = Depends(get_quest_service),
):
    seed_first_quest(db, quest_service)
    return quest_service.list_quests(db)


@router.post("/{quest_id}/complete", response_model=QuestCompletionResponse)
def complete_quest(
    quest_id: str,
    db: Session = Depends(get_db),
    quest_service: QuestService = Depends(get_quest_service),
):
    return quest_service.complete_quest(db, quest_id)