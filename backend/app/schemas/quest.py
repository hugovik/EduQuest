from pydantic import BaseModel


class QuestRead(BaseModel):
    id: str
    title: str
    realm: str
    subject: str
    passage: str | None = None
    question: str | None = None
    answer: str | None = None
    xp_reward: int
    repeatable: bool = False

    model_config = {
        "from_attributes": True
    }