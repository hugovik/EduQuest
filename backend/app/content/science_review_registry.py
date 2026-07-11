from app.content.science_registry import SCIENCE_EXPERIMENTS


SCIENCE_REVIEW_ITEMS = {
    "electricity-1": {
        "activity_type": "observation",
        "answer_key": "Battery",
        "allowed_answers": ["Battery", "Paper", "Leaf", "Spoon"],
    },
    "electricity-2": {
        "activity_type": "classification",
        "answer_key": {
            "battery": "Power Source",
            "solar-cell": "Power Source",
            "apple": "Not a Power Source",
            "rock": "Not a Power Source",
        },
    },
    "electricity-3": {
        "activity_type": "matching",
        "answer_key": {
            "Battery": "Provides energy",
            "Wire": "Carries electricity",
            "Bulb": "Produces light",
            "Switch": "Opens or closes the circuit",
        },
    },
    "electricity-4": {
        "activity_type": "sequencing",
        "answer_key": ["battery", "wire", "switch", "bulb"],
    },
    "electricity-5": {
        "activity_type": "prediction",
        "answer_key": "The bulb goes out.",
        "allowed_answers": [
            "The bulb goes out.",
            "The bulb becomes brighter.",
            "Nothing changes.",
            "The wire turns into a battery.",
        ],
    },
    "magnets-1": {
        "activity_type": "observation",
        "answer_key": "Paper clip",
        "allowed_answers": ["Paper clip", "Wooden stick", "Plastic cup", "Leaf"],
    },
    "magnets-2": {
        "activity_type": "classification",
        "answer_key": {
            "spoon": "Magnetic",
            "coin": "Not Magnetic",
            "plastic-cup": "Not Magnetic",
            "wooden-stick": "Not Magnetic",
            "paper-clip": "Magnetic",
            "aluminum-can": "Not Magnetic",
        },
    },
    "magnets-3": {
        "activity_type": "matching",
        "answer_key": {
            "Bar magnet": "Strong pull",
            "Small fridge magnet": "Weak pull",
            "Horseshoe magnet": "Strong pull",
            "Fridge note magnet": "Common household use",
        },
    },
    "magnets-4": {
        "activity_type": "sequencing",
        "answer_key": ["tool", "test", "observe", "find"],
    },
    "magnets-5": {
        "activity_type": "prediction",
        "answer_key": "The compass needle can move toward the magnet.",
        "allowed_answers": [
            "The compass needle can move toward the magnet.",
            "The compass disappears.",
            "The compass turns into wood.",
            "Nothing can ever change a compass needle.",
        ],
    },
}


def get_science_review_item(experiment_id: str) -> dict | None:
    return SCIENCE_REVIEW_ITEMS.get(experiment_id)


def validate_science_review_registry(
    experiments: list[dict] | None = None,
    review_items: dict | None = None,
) -> list[str]:
    experiments = experiments if experiments is not None else SCIENCE_EXPERIMENTS
    review_items = review_items if review_items is not None else SCIENCE_REVIEW_ITEMS
    errors: list[str] = []
    experiments_by_id = {experiment["id"]: experiment for experiment in experiments}

    for experiment_id, experiment in experiments_by_id.items():
        if experiment_id not in review_items:
            errors.append(f'experiment "{experiment_id}": missing review answer definition.')
            continue

        review_item = review_items[experiment_id]
        if review_item.get("activity_type") != experiment.get("activity_type"):
            errors.append(f'experiment "{experiment_id}": review activity type mismatch.')

        answer_key = review_item.get("answer_key")
        activity_type = review_item.get("activity_type")
        if activity_type in {"observation", "prediction"}:
            if not isinstance(answer_key, str) or not answer_key:
                errors.append(f'experiment "{experiment_id}": answer key must be a string.')
            if answer_key not in review_item.get("allowed_answers", []):
                errors.append(f'experiment "{experiment_id}": answer key is not an allowed answer.')
        elif activity_type in {"classification", "matching"}:
            if not isinstance(answer_key, dict) or not answer_key:
                errors.append(f'experiment "{experiment_id}": answer key must be a mapping.')
        elif activity_type == "sequencing":
            if not isinstance(answer_key, list) or not answer_key:
                errors.append(f'experiment "{experiment_id}": answer key must be an ordered list.')
        else:
            errors.append(f'experiment "{experiment_id}": unsupported review activity type.')

    for experiment_id in review_items:
        if experiment_id not in experiments_by_id:
            errors.append(f'experiment "{experiment_id}": review answer references unknown experiment.')

    return errors
