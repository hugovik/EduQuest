from pydantic import BaseModel


class ReadingLevelXPAuditRead(BaseModel):
    level: int
    completed_passages: int
    xp: int


class XPAuditRead(BaseModel):
    child_id: int
    child_grade: int
    child_level: int
    child_xp: int
    current_reading_level: int
    current_reading_level_xp: int
    reading_passage_xp: int
    reading_passage_xp_by_level: list[ReadingLevelXPAuditRead]
    hidden_reading_xp: int
    quest_completion_xp: int
    quest_completion_xp_by_subject: dict[str, int]
    adventure_xp_total: int
    achievement_xp: int
    world_quest_xp: int
    penalty_xp: int
    reconciled_xp: int
    unexplained_xp: int
    matches_total: bool
    note: str
