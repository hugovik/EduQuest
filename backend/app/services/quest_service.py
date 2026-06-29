from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.child import Child
from app.models.quest import Quest
from app.models.progress_event import ProgressEvent
from app.models.tree_growth_event import TreeGrowthEvent
from app.repositories.child_repository import ChildRepository
from app.repositories.quest_repository import QuestRepository


class QuestService:
    def __init__(
        self,
        child_repository: ChildRepository,
        quest_repository: QuestRepository,
    ):
        self.child_repository = child_repository
        self.quest_repository = quest_repository

    def get_child_or_create_default(self, db: Session) -> Child:
        child = self.child_repository.get_first(db)

        if child is None:
            child = self.child_repository.create_default_child(db)

        return child

    def list_quests(self, db: Session) -> list[Quest]:
        return self.quest_repository.list_all(db)

    def get_quest(self, db: Session, quest_id: str) -> Quest | None:
        return self.quest_repository.get_by_id(db, quest_id)

    def complete_quest(self, db: Session, quest_id: str) -> dict:
        child = self.get_child_or_create_default(db)
        quest = self.get_quest(db, quest_id)

        if quest is None:
            raise HTTPException(status_code=404, detail="Quest not found")

        child.xp += quest.xp_reward

        if child.xp >= 100 and child.level == 1:
            child.level = 2
            child.tree_stage = "Growing Sapling"
            events = ["Quest Completed", "XP Awarded", "Level Up", "Tree Grew"]
        else:
            events = ["Quest Completed", "XP Awarded", "Tree Sparkled"]

        progress_event = ProgressEvent(
            child_id=child.id,
            event_type="quest_completed",
            title=f"Completed {quest.title}",
            description=f"{child.name} completed a quest in {quest.realm}.",
            xp_change=quest.xp_reward,
        )

        tree_event = TreeGrowthEvent(
            child_id=child.id,
            growth_type="new_leaf",
            description="A new leaf appeared on the Tree of Growth.",
        )

        db.add(progress_event)
        db.add(tree_event)
        db.commit()
        db.refresh(child)

        return {
            "child": child,
            "reward": {
                "xp": quest.xp_reward,
            },
            "events": events,
        }