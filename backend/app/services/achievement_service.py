from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.achievement import Achievement
from app.models.child import Child
from app.models.daily_goal import DailyGoal
from app.models.learning_streak import LearningStreak
from app.models.obstacle_progress import ObstacleProgress
from app.repositories.achievement_repository import AchievementRepository
from app.repositories.child_repository import ChildRepository
from app.services.progression_rules import (
    calculate_level_from_xp,
    calculate_tree_stage_from_xp,
)

BASE_ACHIEVEMENTS = [
    {
        "id": "first-quest",
        "name": "First Quest",
        "description": "Complete your first learning adventure.",
        "category": "quest",
        "icon": "⭐",
        "trigger_type": "completed_quests",
        "trigger_threshold": 1,
    },
    {
        "id": "five-quests",
        "name": "Quest Explorer",
        "description": "Complete five learning adventures.",
        "category": "quest",
        "icon": "🧭",
        "trigger_type": "completed_quests",
        "trigger_threshold": 5,
    },
    {
        "id": "hundred-xp",
        "name": "Growing Hero",
        "description": "Earn 100 XP from completed quests.",
        "category": "quest",
        "icon": "🌱",
        "trigger_type": "total_xp",
        "trigger_threshold": 100,
    },
    {
        "id": "first_math_answer",
        "name": "First Step Solver",
        "description": "Answer your first Math Mountains challenge correctly.",
        "category": "math",
        "icon": "🧮",
    },
    {
        "id": "first_bridge_repaired",
        "name": "Bridge Builder",
        "description": "Repair your first bridge in Math Mountains.",
        "category": "math",
        "icon": "🌉",
    },
    {
        "id": "ten_correct_math_answers",
        "name": "Number Explorer",
        "description": "Answer ten Math Mountains challenges correctly.",
        "category": "math",
        "icon": "🔢",
    },
    {
        "id": "first_daily_goal",
        "name": "Daily Hero",
        "description": "Complete your first daily learning goal.",
        "category": "daily",
        "icon": "☀️",
    },
    {
        "id": "three_day_streak",
        "name": "Streak Starter",
        "description": "Complete learning goals for three days in a row.",
        "category": "daily",
        "icon": "🔥",
    },
    {
        "id": "seven_day_streak",
        "name": "Weekly Warrior",
        "description": "Complete learning goals for seven days in a row.",
        "category": "daily",
        "icon": "🏅",
    },
    {
        "id": "first_adventure_entered",
        "name": "Brave Explorer",
        "description": "Enter your first learning adventure.",
        "category": "adventure",
        "icon": "🧭",
    },
    {
        "id": "first_obstacle_completed",
        "name": "Trail Helper",
        "description": "Complete your first adventure obstacle.",
        "category": "adventure",
        "icon": "🛤️",
    },
]


class AchievementService:
    def __init__(
        self,
        child_repository: ChildRepository,
        achievement_repository: AchievementRepository,
    ):
        self.child_repository = child_repository
        self.achievement_repository = achievement_repository

    def get_child_or_create_default(self, db: Session) -> Child:
        child = self.child_repository.get_first(db)

        if child is None:
            child = self.child_repository.create_default_child(db)

        return child

    def seed_achievements(self, db: Session) -> None:
        for item in BASE_ACHIEVEMENTS:
            existing = self.achievement_repository.get_by_id(db, item["id"])
            if existing is not None:
                self.sync_achievement(existing, item)
                continue

            self.achievement_repository.create(
                db,
                Achievement(
                    id=item["id"],
                    key=item["id"],
                    title=item["name"],
                    name=item["name"],
                    description=item["description"],
                    category=item.get("category", "general"),
                    icon=item.get("icon", "🏆"),
                    xp_bonus=item.get("xp_bonus", 0),
                    active=item.get("active", True),
                    trigger_type=item.get("trigger_type", "event"),
                    trigger_threshold=item.get("trigger_threshold", 1),
                ),
            )

        db.flush()

    def sync_achievement(self, achievement: Achievement, item: dict) -> None:
        achievement.key = achievement.key or item["id"]
        achievement.name = achievement.name or item["name"]
        achievement.title = achievement.title or item["name"]
        achievement.description = achievement.description or item["description"]
        achievement.category = achievement.category or item.get("category", "general")
        achievement.icon = achievement.icon or item.get("icon", "🏆")
        achievement.xp_bonus = achievement.xp_bonus or item.get("xp_bonus", 0)
        achievement.active = True if achievement.active is None else achievement.active

    def list_all(self, db: Session) -> list[Achievement]:
        self.seed_achievements(db)
        return self.achievement_repository.list_all(db)

    def list_earned(self, db: Session) -> list[dict]:
        child = self.get_child_or_create_default(db)
        self.seed_achievements(db)
        return self.format_unlock_rows(
            self.achievement_repository.list_unlocks_with_achievements(db, child.id)
        )

    def format_unlock_rows(self, rows) -> list[dict]:
        return [
            {
                "id": unlock.id,
                "achievement_id": unlock.achievement_id,
                "earned_at": unlock.unlocked_at,
                "unlocked_at": unlock.unlocked_at,
                "source_adventure": unlock.source_adventure,
                "metadata": unlock.metadata_json,
                "achievement": achievement,
            }
            for unlock, achievement in rows
        ]

    def apply_xp_bonus(self, child: Child, xp_bonus: int) -> None:
        if xp_bonus <= 0:
            return

        child.xp += xp_bonus
        child.level = calculate_level_from_xp(child.xp)
        child.tree_stage = calculate_tree_stage_from_xp(child.xp)

    def award_once(
        self,
        db: Session,
        child: Child,
        achievement_key: str,
        source_adventure: str | None = None,
        metadata: str | None = None,
    ) -> Achievement | None:
        self.seed_achievements(db)
        achievement = self.achievement_repository.get_by_id(db, achievement_key)

        if achievement is None or not achievement.active:
            return None

        existing = self.achievement_repository.get_unlock(db, child.id, achievement.id)
        if existing is not None:
            return None

        self.achievement_repository.create_unlock(
            db,
            child.id,
            achievement.id,
            source_adventure=source_adventure,
            metadata=metadata,
        )
        self.apply_xp_bonus(child, achievement.xp_bonus or 0)
        return achievement

    def count_math_answers(self, db: Session, child_id: int) -> int:
        return int(
            db.query(func.coalesce(func.sum(ObstacleProgress.current_progress), 0))
            .filter(ObstacleProgress.child_id == child_id)
            .scalar()
            or 0
        )

    def evaluate(
        self,
        db: Session,
        event_type: str,
        child: Child | None = None,
        source_adventure: str | None = None,
        obstacle_progress: ObstacleProgress | None = None,
        daily_goal: DailyGoal | None = None,
        streak: LearningStreak | None = None,
        metadata: str | None = None,
    ) -> list[Achievement]:
        child = child or self.get_child_or_create_default(db)
        earned = []

        if event_type == "correct_math_answer":
            earned.append(self.award_once(db, child, "first_math_answer", "math", metadata))
            if self.count_math_answers(db, child.id) >= 10:
                earned.append(self.award_once(db, child, "ten_correct_math_answers", "math", metadata))

        if event_type == "obstacle_completed":
            earned.append(
                self.award_once(db, child, "first_obstacle_completed", source_adventure or "math", metadata)
            )
            if obstacle_progress and obstacle_progress.obstacle_id == "broken-bridge-001":
                earned.append(self.award_once(db, child, "first_bridge_repaired", "math", metadata))

        if event_type == "daily_goal_completed" and (daily_goal is None or daily_goal.completed):
            earned.append(self.award_once(db, child, "first_daily_goal", source_adventure, metadata))

        if event_type == "streak_updated" and streak is not None:
            if streak.current_streak_days >= 3:
                earned.append(self.award_once(db, child, "three_day_streak", source_adventure, metadata))
            if streak.current_streak_days >= 7:
                earned.append(self.award_once(db, child, "seven_day_streak", source_adventure, metadata))

        if event_type == "adventure_entered":
            earned.append(
                self.award_once(db, child, "first_adventure_entered", source_adventure, metadata)
            )

        return [achievement for achievement in earned if achievement is not None]
