from app.repositories.achievement_repository import AchievementRepository
from app.repositories.child_repository import ChildRepository
from app.repositories.daily_goal_repository import DailyGoalRepository
from app.repositories.inventory_repository import InventoryRepository
from app.repositories.learning_preference_repository import LearningPreferenceRepository
from app.repositories.learning_streak_repository import LearningStreakRepository
from app.repositories.obstacle_progress_repository import ObstacleProgressRepository
from app.repositories.progress_event_repository import ProgressEventRepository
from app.repositories.quest_completion_repository import QuestCompletionRepository
from app.repositories.quest_repository import QuestRepository
from app.repositories.reading_repository import ReadingPassageRepository, ReadingProgressRepository
from app.repositories.reading_story_state_repository import ReadingStoryStateRepository
from app.repositories.tree_growth_event_repository import TreeGrowthEventRepository
from app.repositories.world_state_repository import WorldStateRepository
from app.repositories.world_quest_repository import WorldQuestRepository
from app.services.achievement_service import AchievementService
from app.services.adventure_progress_summary_service import AdventureProgressSummaryService
from app.services.adventure_service import AdventureService
from app.services.adventure_unlock_service import AdventureUnlockService
from app.services.daily_goal_service import DailyGoalService
from app.services.inventory_service import InventoryService
from app.services.learning_preference_service import LearningPreferenceService
from app.services.quest_service import QuestService
from app.services.reading_service import ReadingService
from app.services.reward_service import RewardService
from app.services.world_service import WorldService
from app.services.world_quest_service import WorldQuestService
from app.services.xp_audit_service import XPAuditService


def get_achievement_service() -> AchievementService:
    return AchievementService(
        child_repository=ChildRepository(),
        achievement_repository=AchievementRepository(),
    )


def get_quest_service() -> QuestService:
    return QuestService(
        child_repository=ChildRepository(),
        quest_repository=QuestRepository(),
        quest_completion_repository=QuestCompletionRepository(),
        progress_event_repository=ProgressEventRepository(),
        tree_growth_event_repository=TreeGrowthEventRepository(),
        achievement_repository=AchievementRepository(),
    )


def get_daily_goal_service() -> DailyGoalService:
    return DailyGoalService(
        child_repository=ChildRepository(),
        daily_goal_repository=DailyGoalRepository(),
        learning_streak_repository=LearningStreakRepository(),
    )


def get_inventory_service() -> InventoryService:
    return InventoryService(
        child_repository=ChildRepository(),
        inventory_repository=InventoryRepository(),
    )


def get_reward_service() -> RewardService:
    return RewardService(
        child_repository=ChildRepository(),
        inventory_repository=InventoryRepository(),
        obstacle_progress_repository=ObstacleProgressRepository(),
        daily_goal_service=get_daily_goal_service(),
        achievement_service=get_achievement_service(),
        inventory_service=get_inventory_service(),
    )


def get_reading_service() -> ReadingService:
    return ReadingService(
        child_repository=ChildRepository(),
        passage_repository=ReadingPassageRepository(),
        progress_repository=ReadingProgressRepository(),
        story_state_repository=ReadingStoryStateRepository(),
        daily_goal_service=get_daily_goal_service(),
        achievement_service=get_achievement_service(),
        inventory_service=get_inventory_service(),
    )


def get_learning_preference_service() -> LearningPreferenceService:
    return LearningPreferenceService(
        child_repository=ChildRepository(),
        learning_preference_repository=LearningPreferenceRepository(),
    )


def get_adventure_progress_summary_service() -> AdventureProgressSummaryService:
    return AdventureProgressSummaryService(
        child_repository=ChildRepository(),
    )


def get_adventure_unlock_service() -> AdventureUnlockService:
    return AdventureUnlockService(
        child_repository=ChildRepository(),
        progress_summary_service=get_adventure_progress_summary_service(),
    )


def get_adventure_service() -> AdventureService:
    return AdventureService(
        progress_summary_service=get_adventure_progress_summary_service(),
        adventure_unlock_service=get_adventure_unlock_service(),
    )


def get_world_state_service() -> WorldService:
    return WorldService(
        child_repository=ChildRepository(),
        world_state_repository=WorldStateRepository(),
        inventory_repository=InventoryRepository(),
        inventory_service=get_inventory_service(),
        progress_summary_service=get_adventure_progress_summary_service(),
        adventure_unlock_service=get_adventure_unlock_service(),
        world_quest_service=get_world_quest_service(),
    )


def get_world_quest_service() -> WorldQuestService:
    return WorldQuestService(
        child_repository=ChildRepository(),
        world_quest_repository=WorldQuestRepository(),
        inventory_service=get_inventory_service(),
    )


def get_xp_audit_service() -> XPAuditService:
    return XPAuditService(
        child_repository=ChildRepository(),
    )
