from app.repositories.achievement_repository import AchievementRepository
from app.repositories.child_repository import ChildRepository
from app.repositories.inventory_repository import InventoryRepository
from app.repositories.learning_preference_repository import LearningPreferenceRepository
from app.repositories.obstacle_progress_repository import ObstacleProgressRepository
from app.repositories.progress_event_repository import ProgressEventRepository
from app.repositories.quest_completion_repository import QuestCompletionRepository
from app.repositories.quest_repository import QuestRepository
from app.repositories.tree_growth_event_repository import TreeGrowthEventRepository
from app.services.quest_service import QuestService


def get_quest_service() -> QuestService:
    return QuestService(
        child_repository=ChildRepository(),
        quest_repository=QuestRepository(),
        quest_completion_repository=QuestCompletionRepository(),
        progress_event_repository=ProgressEventRepository(),
        tree_growth_event_repository=TreeGrowthEventRepository(),
        achievement_repository=AchievementRepository(),
    )

from app.services.reward_service import RewardService


def get_reward_service() -> RewardService:
    return RewardService(
        child_repository=ChildRepository(),
        inventory_repository=InventoryRepository(),
        obstacle_progress_repository=ObstacleProgressRepository(),
    )

from app.services.learning_preference_service import LearningPreferenceService


def get_learning_preference_service() -> LearningPreferenceService:
    return LearningPreferenceService(
        child_repository=ChildRepository(),
        learning_preference_repository=LearningPreferenceRepository(),
    )

from app.services.adventure_progress_summary_service import AdventureProgressSummaryService


def get_adventure_progress_summary_service() -> AdventureProgressSummaryService:
    return AdventureProgressSummaryService(
        child_repository=ChildRepository(),
    )
