from pydantic import BaseModel


class ChildRead(BaseModel):
    id: int
    name: str
    grade: int
    level: int
    xp: int
    tree_stage: str

    model_config = {
        "from_attributes": True
    }