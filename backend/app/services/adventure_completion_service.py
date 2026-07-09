from sqlalchemy.orm import Session

from app.models.child import Child
from app.models.progress_event import ProgressEvent
from app.models.tree_growth_event import TreeGrowthEvent
from app.services.progression_rules import (
    calculate_level_from_xp,
    calculate_tree_stage_from_xp,
)


class AdventureCompletionService:
    def apply_xp_reward(
        self,
        db: Session,
        child: Child,
        *,
        xp_awarded: int,
        event_type: str,
        title: str,
        description: str,
        growth_type: str,
        growth_description: str,
    ) -> None:
        previous_tree_stage = child.tree_stage

        child.xp += xp_awarded
        child.level = calculate_level_from_xp(child.xp)
        child.tree_stage = calculate_tree_stage_from_xp(child.xp)

        db.add(
            ProgressEvent(
                child_id=child.id,
                quest_completion_id=None,
                event_type=event_type,
                title=title,
                description=description,
                xp_change=xp_awarded,
            )
        )
        db.add(
            TreeGrowthEvent(
                child_id=child.id,
                quest_completion_id=None,
                growth_type=growth_type
                if child.tree_stage != previous_tree_stage
                else "adventure_spark",
                description=growth_description,
            )
        )
