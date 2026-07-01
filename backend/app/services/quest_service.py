from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.achievement import Achievement
from app.models.achievement_unlock import AchievementUnlock
from app.models.child import Child
from app.models.quest import Quest
from app.models.progress_event import ProgressEvent
from app.models.quest_completion import QuestCompletion
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
            existing = db.query(Achievement).filter(Achievement.id == achievement.id).first()
            if existing is None:
                db.add(achievement)

        db.flush()

    def get_progress_summary(self, db: Session) -> dict:
        child = self.get_child_or_create_default(db)
        self.seed_achievements(db)
        unlocked_achievements = self.list_unlocked_achievements(db)

        completed_quests = (
            db.query(QuestCompletion)
            .filter(QuestCompletion.child_id == child.id)
            .count()
        )
        total_xp_awarded = (
            db.query(func.coalesce(func.sum(QuestCompletion.xp_awarded), 0))
            .filter(QuestCompletion.child_id == child.id)
            .scalar()
        )
        progress_events = (
            db.query(ProgressEvent)
            .filter(ProgressEvent.child_id == child.id)
            .count()
        )
        tree_growth_events = (
            db.query(TreeGrowthEvent)
            .filter(TreeGrowthEvent.child_id == child.id)
            .count()
        )

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

        rows = (
            db.query(AchievementUnlock, Achievement)
            .join(Achievement, AchievementUnlock.achievement_id == Achievement.id)
            .filter(AchievementUnlock.child_id == child.id)
            .order_by(AchievementUnlock.unlocked_at.desc())
            .all()
        )

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

        completed_quests = (
            db.query(QuestCompletion)
            .filter(QuestCompletion.child_id == child.id)
            .count()
        )
        total_xp_awarded = (
            db.query(func.coalesce(func.sum(QuestCompletion.xp_awarded), 0))
            .filter(QuestCompletion.child_id == child.id)
            .scalar()
        )

        achievements = db.query(Achievement).all()
        newly_unlocked = []

        for achievement in achievements:
            already_unlocked = (
                db.query(AchievementUnlock)
                .filter(
                    AchievementUnlock.child_id == child.id,
                    AchievementUnlock.achievement_id == achievement.id,
                )
                .first()
            )

            if already_unlocked is not None:
                continue

            value = completed_quests
            if achievement.trigger_type == "total_xp":
                value = total_xp_awarded

            if value >= achievement.trigger_threshold:
                db.add(
                    AchievementUnlock(
                        child_id=child.id,
                        achievement_id=achievement.id,
                    )
                )
                newly_unlocked.append(achievement)

        return newly_unlocked

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

        quest_completion = QuestCompletion(
            child_id=child.id,
            quest_id=quest.id,
            xp_awarded=quest.xp_reward,
        )

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

        db.add(quest_completion)
        db.add(progress_event)
        db.add(tree_event)
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
