from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.achievement import Achievement
from app.models.child import Child
from app.models.quest import Quest
from app.repositories.achievement_repository import AchievementRepository
from app.repositories.child_repository import ChildRepository
from app.repositories.progress_event_repository import ProgressEventRepository
from app.repositories.quest_completion_repository import QuestCompletionRepository
from app.repositories.quest_repository import QuestRepository
from app.repositories.tree_growth_event_repository import TreeGrowthEventRepository
from app.services.progression_rules import (
    calculate_level_from_xp,
    calculate_tree_stage_from_xp,
)


class QuestService:
    def __init__(
        self,
        child_repository: ChildRepository,
        quest_repository: QuestRepository,
        quest_completion_repository: QuestCompletionRepository,
        progress_event_repository: ProgressEventRepository,
        tree_growth_event_repository: TreeGrowthEventRepository,
        achievement_repository: AchievementRepository,
    ):
        self.child_repository = child_repository
        self.quest_repository = quest_repository
        self.quest_completion_repository = quest_completion_repository
        self.progress_event_repository = progress_event_repository
        self.tree_growth_event_repository = tree_growth_event_repository
        self.achievement_repository = achievement_repository

    def get_child_or_create_default(self, db: Session) -> Child:
        child = self.child_repository.get_first(db)

        if child is None:
            child = self.child_repository.create_default_child(db)

        return child

    def list_quests(self, db: Session) -> list[Quest]:
        return self.quest_repository.list_all(db)

    def get_quest(self, db: Session, quest_id: str) -> Quest | None:
        return self.quest_repository.get_by_id(db, quest_id)

    def seed_achievements(self, db: Session) -> None:
        default_achievements = [
            Achievement(
                id="first-quest",
                title="First Quest",
                description="Complete your first learning adventure.",
                icon="⭐",
                trigger_type="completed_quests",
                trigger_threshold=1,
            ),
            Achievement(
                id="five-quests",
                title="Quest Explorer",
                description="Complete five learning adventures.",
                icon="🧭",
                trigger_type="completed_quests",
                trigger_threshold=5,
            ),
            Achievement(
                id="hundred-xp",
                title="Growing Hero",
                description="Earn 100 XP from completed quests.",
                icon="🌱",
                trigger_type="total_xp",
                trigger_threshold=100,
            ),
        ]

        for achievement in default_achievements:
            existing = self.achievement_repository.get_by_id(db, achievement.id)
            if existing is None:
                self.achievement_repository.create(db, achievement)

        db.flush()

    def get_progress_summary(self, db: Session) -> dict:
        child = self.get_child_or_create_default(db)
        self.seed_achievements(db)
        unlocked_achievements = self.list_unlocked_achievements(db)

        completed_quests = self.quest_completion_repository.count_by_child(db, child.id)
        total_xp_awarded = self.quest_completion_repository.total_xp_awarded_by_child(db, child.id)
        progress_events = self.progress_event_repository.count_by_child(db, child.id)
        tree_growth_events = self.tree_growth_event_repository.count_by_child(db, child.id)

        return {
            "child": child,
            "completed_quests": completed_quests,
            "total_xp_awarded": total_xp_awarded,
            "progress_events": progress_events,
            "tree_growth_events": tree_growth_events,
            "tree_stage": child.tree_stage,
            "achievements_unlocked": len(unlocked_achievements),
            "achievements": unlocked_achievements,
        }

    def list_unlocked_achievements(self, db: Session) -> list[dict]:
        child = self.get_child_or_create_default(db)

        rows = self.achievement_repository.list_unlocks_with_achievements(db, child.id)

        return [
            {
                "id": unlock.id,
                "achievement_id": unlock.achievement_id,
                "unlocked_at": unlock.unlocked_at,
                "achievement": achievement,
            }
            for unlock, achievement in rows
        ]

    def unlock_eligible_achievements(self, db: Session, child: Child) -> list[Achievement]:
        self.seed_achievements(db)

        completed_quests = self.quest_completion_repository.count_by_child(db, child.id)
        total_xp_awarded = self.quest_completion_repository.total_xp_awarded_by_child(db, child.id)

        achievements = self.achievement_repository.list_all(db)
        newly_unlocked = []

        for achievement in achievements:
            already_unlocked = self.achievement_repository.get_unlock(db, child.id, achievement.id)

            if already_unlocked is not None:
                continue

            if achievement.trigger_type not in {"completed_quests", "total_xp"}:
                continue

            value = completed_quests
            if achievement.trigger_type == "total_xp":
                value = total_xp_awarded

            if value >= achievement.trigger_threshold:
                self.achievement_repository.create_unlock(db, child.id, achievement.id)
                newly_unlocked.append(achievement)

        return newly_unlocked

    def complete_quest(self, db: Session, quest_id: str) -> dict:
        child = self.get_child_or_create_default(db)
        quest = self.get_quest(db, quest_id)

        if quest is None:
            raise HTTPException(status_code=404, detail="Quest not found")

        existing_completion = self.quest_completion_repository.get_by_child_and_quest(
            db,
            child.id,
            quest.id,
        )

        if existing_completion is not None and not quest.repeatable:
            raise HTTPException(status_code=409, detail="Quest already completed")

        previous_level = child.level
        previous_tree_stage = child.tree_stage

        child.xp += quest.xp_reward
        child.level = calculate_level_from_xp(child.xp)
        child.tree_stage = calculate_tree_stage_from_xp(child.xp)

        events = ["Quest Completed", "XP Awarded"]

        if child.level > previous_level:
            events.append("Level Up")

        if child.tree_stage != previous_tree_stage:
            events.append("Tree Grew")
        else:
            events.append("Tree Sparkled")

        quest_completion = self.quest_completion_repository.create(
            db,
            child.id,
            quest.id,
            quest.xp_reward,
        )

        self.progress_event_repository.create_quest_completed_event(
            db,
            child.id,
            quest_completion.id,
            f"Completed {quest.title}",
            f"{child.name} completed a quest in {quest.realm}.",
            quest.xp_reward,
        )

        self.tree_growth_event_repository.create_growth_event(
            db,
            child.id,
            quest_completion.id,
            "new_leaf",
            "A new leaf appeared on the Tree of Growth.",
        )

        db.flush()

        unlocked_achievements = self.unlock_eligible_achievements(db, child)

        if unlocked_achievements:
            events.extend([f"Achievement Unlocked: {item.title}" for item in unlocked_achievements])

        db.commit()
        db.refresh(child)
        db.refresh(quest_completion)

        return {
            "child": child,
            "reward": {
                "xp": quest.xp_reward,
            },
            "events": events,
            "quest_completion_id": quest_completion.id,
            "achievements_unlocked": unlocked_achievements,
        }
