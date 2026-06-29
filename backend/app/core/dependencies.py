from app.repositories.child_repository import ChildRepository
from app.repositories.quest_repository import QuestRepository
from app.services.quest_service import QuestService


def get_quest_service() -> QuestService:
    return QuestService(
        child_repository=ChildRepository(),
        quest_repository=QuestRepository(),
    )