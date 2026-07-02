from datetime import datetime

from pydantic import BaseModel, Field

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


class ReadingStoryCharacterRead(BaseModel):
    id: str
    name: str
    role: str
    description: str
    portrait: str | None = None


class ReadingStoryArtworkRead(BaseModel):
    illustration: str | None = None
    background: str | None = None
    character_portrait: str | None = None


class ReadingStoryChoiceRead(BaseModel):
    id: str
    label: str
    dialogue: str
    outcome_text: str
    bonus_vocabulary: list[VocabularyWordRead] = Field(default_factory=list)


class ReadingCollectibleRead(BaseModel):
    id: str
    type: str
    name: str
    description: str
    icon: str


class ReadingInteractiveElementRead(BaseModel):
    id: str
    label: str
    description: str
    action_label: str
    result_text: str
    collectible: ReadingCollectibleRead | None = None


class ReadingPassageRead(BaseModel):
    id: str
    title: str
    level: int
    text: str
    estimated_reading_time: str
    vocabulary_words: list[VocabularyWordRead]
    questions: list[ReadingQuestionRead]
    map_node_name: str | None = None
    unlocked: bool = False
    locked: bool = True
    completed: bool = False
    best_score: int | None = None
    best_accuracy: float | None = None
    xp_awarded: int = 0
    chapter_id: str | None = None
    chapter_title: str | None = None
    story_arc_title: str = "The Hidden Grove Adventure"
    characters: list[ReadingStoryCharacterRead] = Field(default_factory=list)
    artwork: ReadingStoryArtworkRead | None = None
    choices: list[ReadingStoryChoiceRead] = Field(default_factory=list)
    interactive_elements: list[ReadingInteractiveElementRead] = Field(default_factory=list)


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
    unlocked_passage_ids: list[str]
    passages_completed: int
    questions_answered: int
    correct_answers: int
    accuracy: float
    total_xp_earned: int
    vocabulary_learned: int
    vocabulary_words: list[str]


class ReadingSubmitRequest(BaseModel):
    answers: dict[str, object]


class ReadingStoryChoiceRequest(BaseModel):
    passage_id: str
    choice_id: str


class ReadingStoryInteractionRequest(BaseModel):
    passage_id: str
    interaction_id: str


class ReadingStoryJournalEntryRead(BaseModel):
    id: str
    passage_id: str | None = None
    title: str
    text: str
    type: str
    created_at: str


class ReadingStoryStateRead(BaseModel):
    child_id: int
    current_chapter_id: str | None = None
    choices_made: dict[str, str]
    collectibles_found: list[ReadingCollectibleRead]
    journal_entries: list[ReadingStoryJournalEntryRead]
    characters_met: list[ReadingStoryCharacterRead]


class ReadingStoryChoiceResponse(BaseModel):
    story_state: ReadingStoryStateRead
    choice: ReadingStoryChoiceRead
    events: list[str]


class ReadingStoryInteractionResponse(BaseModel):
    story_state: ReadingStoryStateRead
    interaction: ReadingInteractiveElementRead
    collectible_awarded: ReadingCollectibleRead | None = None
    duplicate: bool = False
    events: list[str]


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
    achievements_unlocked: list[AchievementRead] = Field(default_factory=list)
    story_state: ReadingStoryStateRead | None = None
    collectibles_found: list[ReadingCollectibleRead] = Field(default_factory=list)
    next_chapter_unlocked: str | None = None
    duplicate: bool = False
