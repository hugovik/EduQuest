from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.database import Base
from app.models.achievement import Achievement
from app.models.achievement_unlock import AchievementUnlock
from app.models.progress_event import ProgressEvent
from app.models.reading_progress import ReadingProgress
from app.repositories.child_repository import ChildRepository
from app.services.xp_audit_service import XPAuditService


def make_db_session():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return engine, TestingSessionLocal()


def test_default_child_xp_is_reported_as_unexplained():
    engine, db = make_db_session()
    try:
        audit = XPAuditService(ChildRepository()).get_audit(db)

        assert audit["child_xp"] == 40
        assert audit["reconciled_xp"] == 0
        assert audit["unexplained_xp"] == 40
        assert audit["matches_total"] is False
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


def test_reading_xp_reconciles_against_child_total():
    engine, db = make_db_session()
    try:
        child = ChildRepository().create_default_child(db)
        child.xp = 15
        db.add(
            ReadingProgress(
                child_id=child.id,
                passage_id="reading-l2-01",
                level=2,
                questions_answered=4,
                correct_answers=3,
                vocabulary_learned=2,
                xp_awarded=15,
                completed=True,
            )
        )
        db.commit()

        audit = XPAuditService(ChildRepository()).get_audit(db)

        assert audit["current_reading_level"] == 2
        assert audit["current_reading_level_xp"] == 15
        assert audit["reading_passage_xp"] == 15
        assert audit["hidden_reading_xp"] == 0
        assert audit["adventure_xp_total"] == 15
        assert audit["reconciled_xp"] == 15
        assert audit["unexplained_xp"] == 0
        assert audit["matches_total"] is True
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


def test_audit_surfaces_hidden_cross_level_reading_xp():
    engine, db = make_db_session()
    try:
        child = ChildRepository().create_default_child(db)
        child.xp = 15
        db.add(
            ReadingProgress(
                child_id=child.id,
                passage_id="reading-l2-01",
                level=2,
                questions_answered=4,
                correct_answers=3,
                vocabulary_learned=2,
                xp_awarded=15,
                completed=True,
            )
        )
        db.add(
            ReadingProgress(
                child_id=child.id,
                passage_id="reading-l1-01",
                level=1,
                questions_answered=4,
                correct_answers=3,
                vocabulary_learned=2,
                xp_awarded=15,
                completed=True,
            )
        )
        db.commit()

        audit = XPAuditService(ChildRepository()).get_audit(db)

        assert audit["current_reading_level_xp"] == 15
        assert audit["reading_passage_xp"] == 30
        assert audit["hidden_reading_xp"] == 15
        assert audit["unexplained_xp"] == -15
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


def test_audit_includes_achievement_bonus_and_penalties():
    engine, db = make_db_session()
    try:
        child = ChildRepository().create_default_child(db)
        child.xp = 18
        achievement = Achievement(
            id="bonus-test",
            key="bonus-test",
            title="Bonus Test",
            name="Bonus Test",
            description="Test bonus.",
            category="test",
            icon="*",
            xp_bonus=5,
            trigger_type="event",
            trigger_threshold=1,
        )
        db.add(achievement)
        db.add(AchievementUnlock(child_id=child.id, achievement_id=achievement.id))
        db.add(
            ReadingProgress(
                child_id=child.id,
                passage_id="reading-l2-01",
                level=2,
                questions_answered=4,
                correct_answers=3,
                vocabulary_learned=2,
                xp_awarded=15,
                completed=True,
            )
        )
        db.add(
            ProgressEvent(
                child_id=child.id,
                event_type="xp_penalty",
                title="Incorrect answer",
                description="Penalty",
                xp_change=-2,
            )
        )
        db.commit()

        audit = XPAuditService(ChildRepository()).get_audit(db)

        assert audit["achievement_xp"] == 5
        assert audit["penalty_xp"] == -2
        assert audit["reconciled_xp"] == 18
        assert audit["matches_total"] is True
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


def test_audit_includes_world_quest_reward_xp():
    engine, db = make_db_session()
    try:
        child = ChildRepository().create_default_child(db)
        child.xp = 65
        db.add(
            ProgressEvent(
                child_id=child.id,
                event_type="world_quest_reward",
                title="Restore the EduQuest World",
                description="Completed world quest.",
                xp_change=25,
            )
        )
        db.commit()

        audit = XPAuditService(ChildRepository()).get_audit(db)

        assert audit["world_quest_xp"] == 25
        assert audit["reconciled_xp"] == 25
        assert audit["unexplained_xp"] == 40
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)
