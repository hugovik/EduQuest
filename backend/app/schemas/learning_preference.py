from datetime import datetime

from pydantic import BaseModel, Field


class LearningPreferenceUpdate(BaseModel):
    override_level: int | None = Field(default=None, ge=1, le=5)


class LearningPreferenceRead(BaseModel):
    id: int
    child_id: int
    adventure_type: str
    override_level: int | None
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }
