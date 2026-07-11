from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.achievement_unlock import AchievementUnlock
from app.models.adventure_level_preference import AdventureLevelPreference
from app.models.child import Child
from app.models.daily_goal import DailyGoal
from app.models.learning_streak import LearningStreak
from app.models.obstacle_progress import ObstacleProgress
from app.models.player_inventory import InventoryItem, PlayerInventory
from app.models.progress_event import ProgressEvent
from app.models.quest_completion import QuestCompletion
from app.models.reading_progress import ReadingProgress
from app.models.reading_story_state import ReadingStoryState
from app.models.science_progress import ScienceProgress
from app.models.science_review_attempt import ScienceReviewAttempt
from app.models.tree_growth_event import TreeGrowthEvent
from app.models.world_state import WorldState
from app.models.world_quest import WorldQuest
from app.models.writing_progress import WritingProgress

router = APIRouter(prefix="/dev", tags=["dev"])


RESET_TABLES = [
    AchievementUnlock,
    AdventureLevelPreference,
    DailyGoal,
    LearningStreak,
    InventoryItem,
    PlayerInventory,
    ObstacleProgress,
    ReadingProgress,
    ReadingStoryState,
    ScienceProgress,
    ScienceReviewAttempt,
    WritingProgress,
    WorldState,
    WorldQuest,
    QuestCompletion,
    ProgressEvent,
    TreeGrowthEvent,
]


@router.post("/reset-progress")
def reset_progress(db: Session = Depends(get_db)):
    deleted_rows = {}

    for model in RESET_TABLES:
        deleted_rows[model.__tablename__] = db.query(model).delete(
            synchronize_session=False,
        )

    children = db.query(Child).all()

    for child in children:
        child.xp = 0
        child.level = 1
        child.tree_stage = "Seedling"

    db.commit()

    return {
        "status": "ok",
        "message": "Progress reset for development testing.",
        "children_reset": len(children),
        "deleted_rows": deleted_rows,
    }
