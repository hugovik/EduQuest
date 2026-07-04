import json
from datetime import datetime

from sqlalchemy.orm import Session

from app.models.progress_event import ProgressEvent
from app.models.world_quest import WorldQuest
from app.repositories.child_repository import ChildRepository
from app.repositories.world_quest_repository import WorldQuestRepository
from app.services.inventory_service import InventoryService
from app.services.progression_rules import calculate_level_from_xp, calculate_tree_stage_from_xp

WORLD_QUEST_KEY = "restore_eduquest_magic"
WORLD_QUEST_REWARD_XP = 25

WORLD_QUEST_STEPS = [
    {
        "key": "visit_math",
        "title": "Visit Math Mountains",
        "description": "Travel to Math Mountains and begin restoring mountain magic.",
        "region": "math",
    },
    {
        "key": "complete_math_milestone",
        "title": "Restore a Math Spark",
        "description": "Complete one Math Mountains activity or milestone.",
        "region": "math",
    },
    {
        "key": "visit_reading",
        "title": "Visit Reading Forest",
        "description": "Travel to Reading Forest and listen for forest clues.",
        "region": "reading",
    },
    {
        "key": "complete_reading_milestone",
        "title": "Restore a Reading Spark",
        "description": "Complete one Reading Forest passage or activity.",
        "region": "reading",
    },
]

WORLD_QUEST_REWARD_ITEMS = [
    {
        "item_key": "world_heart",
        "item_name": "World Heart",
        "item_type": "artifact",
        "description": "A glowing crystal that restores magic to EduQuest.",
    }
]


class WorldQuestService:
    def __init__(
        self,
        child_repository: ChildRepository,
        world_quest_repository: WorldQuestRepository,
        inventory_service: InventoryService,
    ):
        self.child_repository = child_repository
        self.world_quest_repository = world_quest_repository
        self.inventory_service = inventory_service

    def parse_list(self, value: str | None) -> list:
        if not value:
            return []

        try:
            parsed = json.loads(value)
        except json.JSONDecodeError:
            return []

        return parsed if isinstance(parsed, list) else []

    def get_child_or_create_default(self, db: Session):
        child = self.child_repository.get_first(db)

        if child is None:
            child = self.child_repository.create_default_child(db)

        return child

    def get_or_create_restore_quest(self, db: Session, child_id: int) -> WorldQuest:
        world_quest = self.world_quest_repository.get_by_child_and_key(
            db,
            child_id,
            WORLD_QUEST_KEY,
        )

        if world_quest is not None:
            return world_quest

        world_quest = WorldQuest(
            child_id=child_id,
            quest_key=WORLD_QUEST_KEY,
            title="Restore the EduQuest World",
            description="Help each region recover its magic by completing learning quests.",
            status="not_started",
            steps=json.dumps(WORLD_QUEST_STEPS),
            completed_steps="[]",
            required_regions=json.dumps(["math", "reading"]),
            reward_items=json.dumps(WORLD_QUEST_REWARD_ITEMS),
            reward_xp=WORLD_QUEST_REWARD_XP,
        )
        return self.world_quest_repository.create(db, world_quest)

    def get_completed_steps(self, visited_regions: list[str], progress_summary: dict) -> list[str]:
        completed_steps = []
        math_summary = progress_summary.get("math", {})
        reading_summary = progress_summary.get("reading", {})

        if "math" in visited_regions:
            completed_steps.append("visit_math")
        if (math_summary.get("completed_quests") or 0) >= 1:
            completed_steps.append("complete_math_milestone")
        if "reading" in visited_regions:
            completed_steps.append("visit_reading")
        if (reading_summary.get("completed_quests") or 0) >= 1:
            completed_steps.append("complete_reading_milestone")

        return completed_steps

    def get_status(self, completed_steps: list[str], total_steps: int) -> str:
        if len(completed_steps) >= total_steps:
            return "completed"
        if completed_steps:
            return "in_progress"
        return "not_started"

    def award_completion_once(self, db: Session, child, world_quest: WorldQuest):
        if world_quest.completed_at is not None:
            return

        child.xp += world_quest.reward_xp
        child.level = calculate_level_from_xp(child.xp)
        child.tree_stage = calculate_tree_stage_from_xp(child.xp)
        world_quest.completed_at = datetime.utcnow()

        for item in self.parse_list(world_quest.reward_items):
            self.inventory_service.add_item_once(
                db,
                child.id,
                item["item_key"],
                source_region="world",
                commit=False,
            )

        db.add(
            ProgressEvent(
                child_id=child.id,
                event_type="world_quest_reward",
                title=world_quest.title,
                description="Completed the main EduQuest world quest.",
                xp_change=world_quest.reward_xp,
            )
        )

    def serialize(self, world_quest: WorldQuest) -> dict:
        steps = self.parse_list(world_quest.steps)
        completed_steps = [
            step for step in self.parse_list(world_quest.completed_steps)
            if isinstance(step, str)
        ]
        completed_step_set = set(completed_steps)
        serialized_steps = [
            {
                **step,
                "status": "completed" if step["key"] in completed_step_set else "not_started",
            }
            for step in steps
            if isinstance(step, dict)
        ]
        total_steps = len(serialized_steps)

        return {
            "quest_key": world_quest.quest_key,
            "title": world_quest.title,
            "description": world_quest.description,
            "status": world_quest.status,
            "steps": serialized_steps,
            "completed_steps": completed_steps,
            "required_regions": [
                item for item in self.parse_list(world_quest.required_regions)
                if isinstance(item, str)
            ],
            "reward_items": [
                item for item in self.parse_list(world_quest.reward_items)
                if isinstance(item, dict)
            ],
            "reward_xp": world_quest.reward_xp,
            "progress_percent": round((len(completed_steps) / total_steps) * 100) if total_steps else 0,
            "completed_at": world_quest.completed_at,
        }

    def evaluate_restore_quest(
        self,
        db: Session,
        child,
        visited_regions: list[str],
        progress_summary: dict,
    ) -> dict:
        world_quest = self.get_or_create_restore_quest(db, child.id)
        completed_steps = self.get_completed_steps(visited_regions, progress_summary)
        status = self.get_status(completed_steps, len(WORLD_QUEST_STEPS))

        world_quest.steps = json.dumps(WORLD_QUEST_STEPS)
        world_quest.completed_steps = json.dumps(completed_steps)
        world_quest.required_regions = json.dumps(["math", "reading"])
        world_quest.reward_items = json.dumps(WORLD_QUEST_REWARD_ITEMS)
        world_quest.reward_xp = WORLD_QUEST_REWARD_XP
        world_quest.status = status
        world_quest.updated_at = datetime.utcnow()

        if status == "completed":
            self.award_completion_once(db, child, world_quest)

        db.flush()
        return self.serialize(world_quest)
