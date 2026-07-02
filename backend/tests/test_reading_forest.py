import pytest
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.database import Base
from app.repositories.achievement_repository import AchievementRepository
from app.repositories.child_repository import ChildRepository
from app.repositories.daily_goal_repository import DailyGoalRepository
from app.repositories.learning_streak_repository import LearningStreakRepository
from app.repositories.reading_repository import ReadingPassageRepository, ReadingProgressRepository
from app.services.achievement_service import AchievementService
from app.services.adventure_progress_summary_service import AdventureProgressSummaryService
from app.services.daily_goal_service import DailyGoalService
from app.services.reading_service import READING_CORRECT_ANSWER_XP, ReadingService


@pytest.fixture()
def db_session():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def reading_service():
    child_repository = ChildRepository()
    daily_goal_service = DailyGoalService(
        child_repository=child_repository,
        daily_goal_repository=DailyGoalRepository(),
        learning_streak_repository=LearningStreakRepository(),
    )
    achievement_service = AchievementService(
        child_repository=child_repository,
        achievement_repository=AchievementRepository(),
    )
    return ReadingService(
        child_repository=child_repository,
        passage_repository=ReadingPassageRepository(),
        progress_repository=ReadingProgressRepository(),
        daily_goal_service=daily_goal_service,
        achievement_service=achievement_service,
    )


def correct_answers_for(passage_data):
    answers = {}
    for question in passage_data["questions"]:
        if question["type"] == "sequence":
            answers[question["id"]] = question["items"]
        elif question["type"] == "true_false":
            answers[question["id"]] = "True"
        else:
            answers[question["id"]] = question["options"][0]
    return answers


def test_level_selection_loads_ten_grade_one_passages(db_session, reading_service):
    passages = reading_service.list_passages(db_session, 1)

    assert len(passages) == 10
    assert all(passage["level"] == 1 for passage in passages)


def test_first_passage_is_unlocked_by_default(db_session, reading_service):
    passages = reading_service.list_passages(db_session, 2)

    assert passages[0]["unlocked"] is True
    assert passages[0]["locked"] is False
    assert passages[1]["unlocked"] is False
    assert passages[1]["locked"] is True


def test_next_passage_unlocks_after_completion(db_session, reading_service):
    first_passage = reading_service.list_passages(db_session, 2)[0]
    reading_service.submit_answers(
        db_session,
        first_passage["id"],
        correct_answers_for(first_passage),
    )

    passages = reading_service.list_passages(db_session, 2)

    assert passages[0]["completed"] is True
    assert passages[0]["best_score"] == 4
    assert passages[0]["best_accuracy"] == 1
    assert passages[1]["unlocked"] is True
    assert passages[1]["locked"] is False


def test_locked_passage_cannot_be_submitted_for_rewards_directly(db_session, reading_service):
    child = reading_service.get_child_or_create_default(db_session)
    passages = reading_service.list_passages(db_session, 2)
    locked_passage = passages[1]

    with pytest.raises(HTTPException) as error:
        reading_service.submit_answers(
            db_session,
            locked_passage["id"],
            correct_answers_for(locked_passage),
        )

    db_session.refresh(child)
    progress = reading_service.get_progress(db_session)

    assert error.value.status_code == 403
    assert child.xp == 0
    assert progress == []


def test_passage_exposes_story_chapter_metadata(db_session, reading_service):
    passage = reading_service.list_passages(db_session, 2)[0]

    assert passage["chapter_id"] == passage["id"]
    assert passage["chapter_title"] == "Forest Gate"
    assert passage["characters"]
    assert passage["artwork"]["background"]
    assert passage["choices"]
    assert passage["interactive_elements"]
    assert passage["interactive_elements"][0]["collectible"]


def test_story_choice_persists_in_journal(db_session, reading_service):
    passage = reading_service.list_passages(db_session, 2)[0]
    choice = passage["choices"][0]

    result = reading_service.record_story_choice(db_session, passage["id"], choice["id"])
    state = result["story_state"]

    assert result["choice"]["id"] == choice["id"]
    assert state["choices_made"][passage["id"]] == choice["id"]
    assert state["journal_entries"]
    assert state["characters_met"]


def test_story_interaction_persists_collectible_once(db_session, reading_service):
    passage = reading_service.list_passages(db_session, 2)[0]
    interaction = passage["interactive_elements"][0]

    first = reading_service.record_story_interaction(
        db_session,
        passage["id"],
        interaction["id"],
    )
    second = reading_service.record_story_interaction(
        db_session,
        passage["id"],
        interaction["id"],
    )

    assert first["collectible_awarded"]["id"] == interaction["collectible"]["id"]
    assert first["duplicate"] is False
    assert second["collectible_awarded"] is None
    assert second["duplicate"] is True
    assert len(second["story_state"]["collectibles_found"]) == 1


def test_chapter_completion_updates_story_journal_and_next_chapter(db_session, reading_service):
    passage = reading_service.list_passages(db_session, 2)[0]

    result = reading_service.submit_answers(
        db_session,
        passage["id"],
        correct_answers_for(passage),
    )

    assert result["story_state"]["current_chapter_id"] == "reading-l2-02"
    assert result["next_chapter_unlocked"] == "reading-l2-02"
    assert any(
        entry["type"] == "chapter_complete"
        for entry in result["story_state"]["journal_entries"]
    )


def test_passage_loading_hides_answers(db_session, reading_service):
    passage = reading_service.list_passages(db_session, 2)[0]

    assert passage["questions"]
    assert "answer" not in passage["questions"][0]
    assert "explanation" not in passage["questions"][0]
    assert passage["questions"][0]["hint"]
    assert passage["vocabulary_words"][0]["word"]
    assert passage["vocabulary_words"][0]["definition"]


def test_comprehension_scoring_rewards_and_persists_progress(db_session, reading_service):
    child = reading_service.get_child_or_create_default(db_session)
    starting_xp = child.xp
    passage = reading_service.list_passages(db_session, 2)[0]

    result = reading_service.submit_answers(
        db_session,
        passage["id"],
        correct_answers_for(passage),
    )

    assert result["score"] == 4
    assert result["total_questions"] == 4
    assert result["rewards"]["xp"] == 4 * READING_CORRECT_ANSWER_XP
    assert result["child"].xp == starting_xp + result["rewards"]["xp"]
    assert result["progress"]["completed"] is True
    assert result["progress"]["questions_answered"] == 4
    assert result["progress"]["correct_answers"] == 4
    assert result["progress"]["vocabulary_learned"] == 2
    assert result["progress"]["accuracy"] == 1


def test_duplicate_passage_completion_does_not_award_extra_xp(db_session, reading_service):
    child = reading_service.get_child_or_create_default(db_session)
    passage = reading_service.list_passages(db_session, 2)[0]
    reading_service.submit_answers(db_session, passage["id"], correct_answers_for(passage))
    xp_after_first = child.xp

    duplicate = reading_service.submit_answers(
        db_session,
        passage["id"],
        correct_answers_for(passage),
    )
    db_session.refresh(child)

    assert duplicate["duplicate"] is True
    assert duplicate["rewards"]["xp"] == 0
    assert child.xp == xp_after_first


def test_daily_goal_and_achievement_integration(db_session, reading_service):
    goal = reading_service.daily_goal_service.get_today_goal(db_session)
    goal.target_correct_answers = 1
    db_session.commit()
    passage = reading_service.list_passages(db_session, 1)[0]

    result = reading_service.submit_answers(
        db_session,
        passage["id"],
        {"q1": "Beside the old tree"},
    )
    unlocked_ids = {achievement.id for achievement in result["achievements_unlocked"]}

    assert result["daily_goal"].completed is True
    assert "first_daily_goal" in unlocked_ids


def test_adventure_summary_uses_reading_progress(db_session, reading_service):
    child = reading_service.get_child_or_create_default(db_session)
    child.level = 3
    child.grade = 3
    db_session.commit()
    passage = reading_service.list_passages(db_session, 3)[0]
    reading_service.submit_answers(db_session, passage["id"], correct_answers_for(passage))
    summary_service = AdventureProgressSummaryService(child_repository=ChildRepository())

    summary = summary_service.get_summary(db_session)

    assert summary["reading"]["completed_quests"] == 1
    assert summary["reading"]["total_quests"] >= 10
    assert summary["reading"]["xp_earned"] == 4 * READING_CORRECT_ANSWER_XP
    assert summary["reading"]["status"] == "in_progress"


def test_progress_summary_exposes_parent_friendly_reading_metrics(db_session, reading_service):
    passage = reading_service.list_passages(db_session, 2)[0]
    reading_service.submit_answers(db_session, passage["id"], correct_answers_for(passage))

    summary = reading_service.get_progress_summary(db_session)

    assert summary["completed_passage_ids"] == [passage["id"]]
    assert summary["unlocked_passage_ids"] == ["reading-l2-01", "reading-l2-02"]
    assert summary["passages_completed"] == 1
    assert summary["questions_answered"] == 4
    assert summary["correct_answers"] == 4
    assert summary["accuracy"] == 1
    assert summary["total_xp_earned"] == 4 * READING_CORRECT_ANSWER_XP
    assert summary["vocabulary_learned"] == 2
    assert summary["vocabulary_words"]



def test_string_vocabulary_is_normalized_for_backward_compatibility(reading_service):
    normalized = reading_service.normalize_vocabulary_word("trail")

    assert normalized["word"] == "trail"
    assert normalized["definition"] == "A path through a forest or park."
    assert normalized["example"]


def test_structured_vocabulary_is_preserved(reading_service):
    normalized = reading_service.normalize_vocabulary_word(
        {
            "word": "sparkle",
            "definition": "A quick shine of light.",
            "example": "The lake had a sparkle in the sun.",
        }
    )

    assert normalized["word"] == "sparkle"
    assert normalized["definition"] == "A quick shine of light."
    assert normalized["example"] == "The lake had a sparkle in the sun."



def test_submission_returns_child_friendly_feedback(db_session, reading_service):
    passage = reading_service.list_passages(db_session, 2)[0]

    result = reading_service.submit_answers(
        db_session,
        passage["id"],
        {"q1": "Inside a cave"},
    )
    feedback = result["question_results"][0]

    assert feedback["question_id"] == "q1"
    assert feedback["questionId"] == "q1"
    assert feedback["correct"] is False
    assert feedback["isCorrect"] is False
    assert feedback["player_answer"] == "Inside a cave"
    assert feedback["correct_answer"] == "Beside the old tree"
    assert feedback["expected_answer"] == "Beside the old tree"
    assert feedback["explanation"]


def test_sequence_feedback_returns_correct_event_order(db_session, reading_service):
    passage = reading_service.list_passages(db_session, 2)[0]

    result = reading_service.submit_answers(
        db_session,
        passage["id"],
        {"q3": ["Lena chooses a path", "Lena reads a clue", "Lena enters the forest"]},
    )
    feedback = next(item for item in result["question_results"] if item["question_id"] == "q3")

    assert feedback["correct"] is False
    assert feedback["correct_answer"] == [
        "Lena enters the forest",
        "Lena reads a clue",
        "Lena chooses a path",
    ]
    assert "order" in feedback["explanation"]


def test_vocabulary_feedback_returns_correct_match(db_session, reading_service):
    passage = reading_service.list_passages(db_session, 2)[0]

    result = reading_service.submit_answers(
        db_session,
        passage["id"],
        {"q4": "spaceship"},
    )
    feedback = next(item for item in result["question_results"] if item["question_id"] == "q4")

    assert feedback["correct"] is False
    assert feedback["correct_answer"] == passage["vocabulary_words"][0]["word"]
    assert "vocabulary" in feedback["explanation"]
