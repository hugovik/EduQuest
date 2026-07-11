from pydantic import BaseModel


class ChildRead(BaseModel):
    id: int
    name: str
    grade: int
    level: int
    xp: int
    tree_stage: str
    current_level_xp: int | None = None
    next_level_xp: int | None = None
    xp_progress_percent: int | None = None

    model_config = {
        "from_attributes": True
    }
