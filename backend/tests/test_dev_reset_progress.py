from datetime import date

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.api.dev_routes import reset_progress
from app.database.database import Base
from app.models.achievement import Achievement
from app.models.achievement_unlock import AchievementUnlock
from app.models.adventure_level_preference import AdventureLevelPreference
from app.models.child import Child
from app.models.daily_goal import DailyGoal
from app.models.learning_streak import LearningStreak
from app.models.obstacle_progress import ObstacleProgress
from app.models.player_inventory import InventoryItem, PlayerInventory
from app.models.progress_event import ProgressEvent
from app.models.quest import Quest
from app.models.quest_completion import QuestCompletion
from app.models.reading_passage import ReadingPassage
from app.models.reading_progress import ReadingProgress
from app.models.reading_story_state import ReadingStoryState
from app.models.tree_growth_event import TreeGrowthEvent
from app.models.world_state import WorldState
from app.models.world_quest import WorldQuest


def make_db_session():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return engine, TestingSessionLocal()


def test_reset_progress_clears_all_gameplay_state_but_keeps_definitions():
    engine, db = make_db_session()
    try:
        child = Child(name="Lena", grade=2, level=3, xp=90, tree_stage="Sapling")
        db.add(child)
        db.flush()

        db.add(Quest(id="quest-1", title="Quest", realm="Math", subject="math", xp_reward=25))
        db.add(
            ReadingPassage(
                id="reading-l2-01",
                title="Reading",
                level=2,
                text="Story text",
                estimated_reading_time="1 min",
                vocabulary_words="[]",
                questions="[]",
            )
        )
        db.add(
            Achievement(
                id="achievement-1",
                key="achievement-1",
                title="Badge",
                name="Badge",
                description="Badge definition",
                category="test",
                icon="*",
                xp_bonus=5,
                trigger_type="event",
                trigger_threshold=1,
            )
        )
        db.flush()

        db.add(AchievementUnlock(child_id=child.id, achievement_id="achievement-1"))
        db.add(AdventureLevelPreference(child_id=child.id, adventure_type="reading", override_level=3))
        db.add(DailyGoal(child_id=child.id, date=date.today(), current_correct_answers=4))
        db.add(LearningStreak(child_id=child.id, current_streak_days=2, longest_streak_days=3))
        db.add(PlayerInventory(child_id=child.id, bricks=2, coins=3, stars=1))
        db.add(
            InventoryItem(
                child_id=child.id,
                item_key="reading_leaf",
                item_name="Reading Leaf",
                item_type="collectible",
                quantity=1,
                source_region="reading",
            )
        )
        db.add(ObstacleProgress(child_id=child.id, obstacle_id="broken-bridge-001", current_progress=7))
        db.add(
            ReadingProgress(
                child_id=child.id,
                passage_id="reading-l2-01",
                level=2,
                questions_answered=4,
                correct_answers=3,
                vocabulary_learned=2,
                xp_awarded=15,
                completed=True,
            )
        )
        db.add(ReadingStoryState(child_id=child.id, current_chapter_id="reading-l2-01"))
        db.add(WorldState(child_id=child.id, active_location="reading", last_region="reading"))
        db.add(
            WorldQuest(
                child_id=child.id,
                quest_key="restore_eduquest_magic",
                title="Restore the EduQuest World",
                description="Help each region recover its magic.",
                status="in_progress",
                steps="[]",
                completed_steps='["visit_math"]',
                required_regions='["math", "reading"]',
                reward_items="[]",
                reward_xp=25,
            )
        )
        db.add(QuestCompletion(child_id=child.id, quest_id="quest-1", xp_awarded=25))
        db.add(
            ProgressEvent(
                child_id=child.id,
                event_type="xp_penalty",
                title="Penalty",
                description="Penalty",
                xp_change=-2,
            )
        )
        db.add(
            TreeGrowthEvent(
                child_id=child.id,
                growth_type="new_leaf",
                description="Tree grew",
            )
        )
        db.commit()

        result = reset_progress(db)
        db.refresh(child)

        assert result["status"] == "ok"
        assert child.xp == 0
        assert child.level == 1
        assert child.tree_stage == "Seedling"

        cleared_models = [
            AchievementUnlock,
            AdventureLevelPreference,
            DailyGoal,
            LearningStreak,
            InventoryItem,
            PlayerInventory,
            ObstacleProgress,
            ReadingProgress,
            ReadingStoryState,
            WorldState,
            WorldQuest,
            QuestCompletion,
            ProgressEvent,
            TreeGrowthEvent,
        ]
        for model in cleared_models:
            assert db.query(model).count() == 0

        assert db.query(Quest).count() == 1
        assert db.query(ReadingPassage).count() == 1
        assert db.query(Achievement).count() == 1
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)
