from app.content.science_registry import (
    SCIENCE_TOPICS,
    SCIENCE_EXPERIMENTS,
    get_science_experiment,
    get_science_experiment_ids,
    get_science_experiment_xp,
    get_science_topic,
    get_science_topic_experiments,
    get_completed_science_topics,
    get_total_science_experiments,
    is_science_topic_complete,
    is_valid_science_experiment,
    validate_science_registry,
)
from app.content.science_review_registry import (
    SCIENCE_REVIEW_ITEMS,
    validate_science_review_registry,
)


def test_electricity_and_magnetism_experiments_are_registered():
    topic_ids = {topic["id"] for topic in SCIENCE_TOPICS}
    experiment_ids = set(get_science_experiment_ids())

    assert topic_ids == {"electricity", "magnetism"}
    assert "electricity-1" in experiment_ids
    assert "electricity-5" in experiment_ids
    assert "magnets-1" in experiment_ids
    assert "magnets-5" in experiment_ids


def test_total_science_experiments_equals_ten():
    assert get_total_science_experiments() == 10


def test_topic_first_experiments_have_no_prerequisite():
    assert get_science_experiment("electricity-1")["requires"] is None
    assert get_science_experiment("magnets-1")["requires"] is None


def test_later_experiments_have_topic_local_prerequisites():
    assert get_science_experiment("electricity-2")["requires"] == "electricity-1"
    assert get_science_experiment("electricity-5")["requires"] == "electricity-4"
    assert get_science_experiment("magnets-2")["requires"] == "magnets-1"
    assert get_science_experiment("magnets-5")["requires"] == "magnets-4"


def test_registry_validates_ids_and_xp_rewards():
    assert is_valid_science_experiment("electricity-1") is True
    assert is_valid_science_experiment("unknown-science") is False
    assert get_science_experiment_xp("electricity-1") == 10
    assert get_science_experiment_xp("magnets-5") == 10
    assert get_science_experiment_xp("unknown-science") == 0


def test_topic_helpers_detect_completion_from_registry():
    electricity = get_science_topic("electricity")
    electricity_experiments = get_science_topic_experiments("electricity")
    completed_electricity_ids = [experiment["id"] for experiment in electricity_experiments]

    assert electricity["completion_reward"]["item_key"] == "lightning_crystal"
    assert len(electricity_experiments) == 5
    assert is_science_topic_complete("electricity", completed_electricity_ids) is True
    assert is_science_topic_complete("electricity", completed_electricity_ids[:-1]) is False
    assert [topic["id"] for topic in get_completed_science_topics(completed_electricity_ids)] == [
        "electricity"
    ]


def test_current_science_registry_passes_validation():
    assert validate_science_registry() == []
    assert validate_science_review_registry() == []


def test_review_registry_requires_every_official_experiment():
    review_items = {key: value for key, value in SCIENCE_REVIEW_ITEMS.items() if key != "magnets-5"}

    errors = validate_science_review_registry(review_items=review_items)

    assert any("magnets-5" in error and "missing review answer" in error for error in errors)


def test_review_registry_rejects_unknown_experiment():
    review_items = {
        **SCIENCE_REVIEW_ITEMS,
        "unknown-science": {
            "activity_type": "prediction",
            "answer_key": "Yes",
            "allowed_answers": ["Yes"],
        },
    }

    errors = validate_science_review_registry(review_items=review_items)

    assert any("unknown experiment" in error for error in errors)


def test_review_registry_rejects_activity_type_mismatch():
    review_items = {
        **SCIENCE_REVIEW_ITEMS,
        "electricity-1": {
            **SCIENCE_REVIEW_ITEMS["electricity-1"],
            "activity_type": "classification",
        },
    }

    errors = validate_science_review_registry(review_items=review_items)

    assert any("activity type mismatch" in error for error in errors)


def test_duplicate_experiment_ids_fail_validation():
    experiments = [
        {**SCIENCE_EXPERIMENTS[0]},
        {**SCIENCE_EXPERIMENTS[0]},
    ]

    errors = validate_science_registry(experiments=experiments)

    assert any("duplicate experiment id" in error for error in errors)


def test_unknown_topic_id_fails_validation():
    experiments = [
        {
            **SCIENCE_EXPERIMENTS[0],
            "topic_id": "unknown-topic",
        }
    ]

    errors = validate_science_registry(experiments=experiments)

    assert any("unknown topic id" in error for error in errors)


def test_invalid_activity_type_fails_validation():
    experiments = [
        {
            **SCIENCE_EXPERIMENTS[0],
            "activity_type": "made-up-activity",
        }
    ]

    errors = validate_science_registry(experiments=experiments)

    assert any("invalid activity type" in error for error in errors)


def test_cross_topic_prerequisite_fails_validation():
    experiments = [
        {**SCIENCE_EXPERIMENTS[0]},
        {
            **SCIENCE_EXPERIMENTS[5],
            "requires": "electricity-1",
        },
    ]

    errors = validate_science_registry(experiments=experiments)

    assert any("belongs to another topic" in error for error in errors)


def test_missing_prerequisite_fails_validation():
    experiments = [
        {
            **SCIENCE_EXPERIMENTS[1],
            "requires": "missing-experiment",
        }
    ]

    errors = validate_science_registry(experiments=experiments)

    assert any("does not exist" in error for error in errors)


def test_circular_prerequisites_fail_validation():
    experiments = [
        {
            **SCIENCE_EXPERIMENTS[0],
            "requires": "electricity-2",
        },
        {
            **SCIENCE_EXPERIMENTS[1],
            "requires": "electricity-1",
        },
    ]

    errors = validate_science_registry(experiments=experiments)

    assert any("circular prerequisite chain" in error for error in errors)


def test_first_mission_with_prerequisite_fails_validation():
    experiments = [
        {
            **SCIENCE_EXPERIMENTS[0],
            "requires": "electricity-0",
        }
    ]

    errors = validate_science_registry(experiments=experiments)

    assert any("first mission" in error for error in errors)


def test_duplicate_mission_order_fails_validation():
    experiments = [
        {**SCIENCE_EXPERIMENTS[0]},
        {
            **SCIENCE_EXPERIMENTS[1],
            "order": 1,
        },
    ]

    errors = validate_science_registry(experiments=experiments)

    assert any("duplicate mission order" in error for error in errors)


def test_later_mission_missing_expected_prerequisite_fails_validation():
    experiments = [
        {**SCIENCE_EXPERIMENTS[0]},
        {
            **SCIENCE_EXPERIMENTS[1],
            "requires": None,
        },
    ]

    errors = validate_science_registry(experiments=experiments)

    assert any("expected prerequisite" in error for error in errors)


def test_non_positive_xp_fails_validation():
    experiments = [
        {
            **SCIENCE_EXPERIMENTS[0],
            "xp_reward": 0,
        }
    ]

    errors = validate_science_registry(experiments=experiments)

    assert any("xp reward" in error for error in errors)
