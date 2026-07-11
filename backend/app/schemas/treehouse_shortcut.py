from datetime import datetime

from pydantic import BaseModel


class TreehouseShortcutRead(BaseModel):
    shortcut_id: str
    region_id: str
    display_name: str
    description: str
    stage: int
    maximum_stage: int
    completed: bool
    eligible: bool
    status: str
    progress_requirement_met: bool
    current_progress: int
    required_progress: int
    required_resource_id: str
    required_resource_name: str
    required_resource_quantity: int
    owned_resource_quantity: int
    can_contribute: bool
    next_stage: int | None
    status_message: str
    action_label: str
    completed_at: datetime | None = None
    display_order: int


class TreehouseShortcutListRead(BaseModel):
    shortcuts: list[TreehouseShortcutRead]
