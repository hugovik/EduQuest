import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.database import Base
from app.models import ObstacleProgress, PlayerInventory
from app.repositories.child_repository import ChildRepository
from app.repositories.inventory_repository import InventoryRepository
from app.repositories.obstacle_progress_repository import ObstacleProgressRepository
from app.services.reward_service import (
    CORRECT_ANSWER_XP,
    INCORRECT_ANSWER_XP_PENALTY,
    RewardService,
)


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
def reward_service():
    return RewardService(
        child_repository=ChildRepository(),
        inventory_repository=InventoryRepository(),
        obstacle_progress_repository=ObstacleProgressRepository(),
    )


def test_inventory_is_created_and_loaded(db_session, reward_service):
    inventory = reward_service.get_inventory(db_session)

    assert inventory.child_id is not None
    assert inventory.bricks == 0
    assert inventory.coins == 0
    assert inventory.stars == 0
    assert reward_service.get_inventory(db_session).id == inventory.id


def test_reward_application_updates_inventory_and_obstacle_progress(db_session, reward_service):
    result = reward_service.reward_correct_answer(db_session, "broken-bridge-001")

    assert result["rewards"]["xp"] == CORRECT_ANSWER_XP
    assert result["rewards"]["bricks"] == 1
    assert result["inventory"].bricks == 0
    assert result["obstacle_progress"].current_progress == 1
    assert result["obstacle_progress"].required_progress == 20
    assert result["obstacle_progress"].completed is False


def test_obstacle_completion_awards_coins_once(db_session, reward_service):
    for _ in range(20):
        result = reward_service.reward_correct_answer(db_session, "broken-bridge-001")

    assert result["obstacle_progress"].completed is True
    assert result["obstacle_progress"].current_progress == 20
    assert result["inventory"].coins == 10
    assert result["rewards"]["coins"] == 10

    duplicate_result = reward_service.reward_correct_answer(db_session, "broken-bridge-001")

    assert duplicate_result["inventory"].coins == 10
    assert duplicate_result["rewards"]["coins"] == 0
    assert duplicate_result["obstacle_progress"].current_progress == 20
    assert db_session.query(PlayerInventory).count() == 1
    assert db_session.query(ObstacleProgress).count() == 1


def test_progress_persists_between_service_calls(db_session, reward_service):
    reward_service.reward_correct_answer(db_session, "broken-bridge-001")
    reward_service.reward_correct_answer(db_session, "broken-bridge-001")

    persisted_progress = reward_service.list_obstacle_progress(db_session)
    bridge_progress = next(
        item for item in persisted_progress if item.obstacle_id == "broken-bridge-001"
    )

    assert bridge_progress.current_progress == 2
    assert bridge_progress.completed is False


def test_incorrect_answer_subtracts_two_xp(db_session, reward_service):
    child = reward_service.get_child_or_create_default(db_session)
    starting_xp = child.xp

    result = reward_service.award_incorrect_answer(db_session, "broken-bridge-001")

    assert result["child"].xp == starting_xp + INCORRECT_ANSWER_XP_PENALTY
    assert result["rewards"]["xp"] == INCORRECT_ANSWER_XP_PENALTY
    assert result["child"].level >= 1


def test_incorrect_answer_never_reduces_xp_below_zero(db_session, reward_service):
    child = reward_service.get_child_or_create_default(db_session)
    child.xp = 1
    child.level = 1
    db_session.commit()

    result = reward_service.award_incorrect_answer(db_session, "broken-bridge-001")

    assert result["child"].xp == 0
    assert result["child"].level == 1
    assert result["rewards"]["xp"] == -1


def test_incorrect_answer_does_not_award_bricks_or_reduce_progress(
    db_session,
    reward_service,
):
    correct_result = reward_service.reward_correct_answer(db_session, "broken-bridge-001")
    progress_after_correct = correct_result["obstacle_progress"].current_progress
    bricks_after_correct = correct_result["inventory"].bricks

    incorrect_result = reward_service.award_incorrect_answer(
        db_session,
        "broken-bridge-001",
    )

    assert incorrect_result["rewards"]["bricks"] == 0
    assert incorrect_result["inventory"].bricks == bricks_after_correct
    assert (
        incorrect_result["obstacle_progress"].current_progress
        == progress_after_correct
    )


def test_incorrect_answer_does_not_create_progress_when_none_was_earned(
    db_session,
    reward_service,
):
    result = reward_service.award_incorrect_answer(db_session, "rockfall-001")

    assert result["rewards"]["bricks"] == 0
    assert result["inventory"].bricks == 0
    assert result["obstacle_progress"].current_progress == 0
    assert result["obstacle_progress"].completed is False
