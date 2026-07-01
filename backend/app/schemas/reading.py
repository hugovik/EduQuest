from datetime import datetime

from pydantic import BaseModel

from app.schemas.achievement import AchievementRead
from app.schemas.child import ChildRead
from app.schemas.daily_goal import DailyGoalRead, LearningStreakRead


class VocabularyWordRead(BaseModel):
    word: str
    definition: str
    example: str | None = None


class ReadingQuestionRead(BaseModel):
    id: str
    type: str
    prompt: str
    options: list[str] | None = None
    pairs: dict[str, str] | None = None
    items: list[str] | None = None
    hint: str | None = None


class ReadingPassageRead(BaseModel):
    id: str
    title: str
    level: int
    text: str
    estimated_reading_time: str
    vocabulary_words: list[VocabularyWordRead]
    questions: list[ReadingQuestionRead]


class ReadingProgressRead(BaseModel):
    child_id: int
    passage_id: str
    level: int
    questions_answered: int
    correct_answers: int
    vocabulary_learned: int
    xp_awarded: int
    completed: bool
    completed_at: datetime | None
    accuracy: float | None = None

    model_config = {"from_attributes": True}


class ReadingProgressSummaryRead(BaseModel):
    completed_passage_ids: list[str]
    passages_completed: int
    questions_answered: int
    correct_answers: int
    accuracy: float
    total_xp_earned: int
    vocabulary_learned: int
    vocabulary_words: list[str]


class ReadingSubmitRequest(BaseModel):
    answers: dict[str, object]


class ReadingQuestionResult(BaseModel):
    question_id: str
    questionId: str | None = None
    prompt: str
    correct: bool
    isCorrect: bool
    player_answer: object | None = None
    correct_answer: object
    expected_answer: object
    explanation: str


class ReadingSubmitResponse(BaseModel):
    child: ChildRead
    progress: ReadingProgressRead
    score: int
    total_questions: int
    accuracy: float
    rewards: dict[str, int]
    events: list[str]
    question_results: list[ReadingQuestionResult]
    daily_goal: DailyGoalRead | None = None
    streak: LearningStreakRead | None = None
    achievements_unlocked: list[AchievementRead] = []
    duplicate: bool = False
