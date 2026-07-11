SCIENCE_TOPICS = [
    {
        "id": "electricity",
        "title": "Electricity",
        "order": 1,
        "completion_reward": {
            "item_key": "lightning_crystal",
            "name": "Lightning Crystal",
            "description": "A glowing crystal earned by mastering Electricity.",
            "icon": "⚡",
            "quantity": 1,
        },
        "achievement_key": "science_electricity_master",
    },
    {
        "id": "magnetism",
        "title": "Magnetism",
        "order": 2,
        "completion_reward": {
            "item_key": "magnetic_compass",
            "name": "Magnetic Compass",
            "description": "A special compass earned by mastering Magnetism.",
            "icon": "🧭",
            "quantity": 1,
        },
        "achievement_key": "science_magnetism_master",
    },
]

SUPPORTED_SCIENCE_ACTIVITY_TYPES = {
    "observation",
    "classification",
    "matching",
    "sequencing",
    "prediction",
}

SCIENCE_EXPERIMENTS = [
    {
        "id": "electricity-1",
        "title": "Light the Bulb",
        "topic_id": "electricity",
        "activity_type": "observation",
        "xp_reward": 10,
        "order": 1,
        "requires": None,
    },
    {
        "id": "electricity-2",
        "title": "Power Source",
        "topic_id": "electricity",
        "activity_type": "classification",
        "xp_reward": 10,
        "order": 2,
        "requires": "electricity-1",
    },
    {
        "id": "electricity-3",
        "title": "Complete the Circuit",
        "topic_id": "electricity",
        "activity_type": "matching",
        "xp_reward": 10,
        "order": 3,
        "requires": "electricity-2",
    },
    {
        "id": "electricity-4",
        "title": "Build the Circuit",
        "topic_id": "electricity",
        "activity_type": "sequencing",
        "xp_reward": 10,
        "order": 4,
        "requires": "electricity-3",
    },
    {
        "id": "electricity-5",
        "title": "What Happens Next?",
        "topic_id": "electricity",
        "activity_type": "prediction",
        "xp_reward": 10,
        "order": 5,
        "requires": "electricity-4",
    },
    {
        "id": "magnets-1",
        "title": "Magnet Mystery",
        "topic_id": "magnetism",
        "activity_type": "observation",
        "xp_reward": 10,
        "order": 1,
        "requires": None,
    },
    {
        "id": "magnets-2",
        "title": "Magnetic or Not?",
        "topic_id": "magnetism",
        "activity_type": "classification",
        "xp_reward": 10,
        "order": 2,
        "requires": "magnets-1",
    },
    {
        "id": "magnets-3",
        "title": "Strong vs Weak",
        "topic_id": "magnetism",
        "activity_type": "matching",
        "xp_reward": 10,
        "order": 3,
        "requires": "magnets-2",
    },
    {
        "id": "magnets-4",
        "title": "Find the Hidden Magnet",
        "topic_id": "magnetism",
        "activity_type": "sequencing",
        "xp_reward": 10,
        "order": 4,
        "requires": "magnets-3",
    },
    {
        "id": "magnets-5",
        "title": "Compass Adventure",
        "topic_id": "magnetism",
        "activity_type": "prediction",
        "xp_reward": 10,
        "order": 5,
        "requires": "magnets-4",
    },
]

SCIENCE_EXPERIMENTS_BY_ID = {
    experiment["id"]: experiment for experiment in SCIENCE_EXPERIMENTS
}


def get_science_experiment(experiment_id: str) -> dict | None:
    return SCIENCE_EXPERIMENTS_BY_ID.get(experiment_id)


def get_science_experiment_ids() -> list[str]:
    return [experiment["id"] for experiment in SCIENCE_EXPERIMENTS]


def get_total_science_experiments() -> int:
    return len(SCIENCE_EXPERIMENTS)


def is_valid_science_experiment(experiment_id: str) -> bool:
    return experiment_id in SCIENCE_EXPERIMENTS_BY_ID


def get_science_experiment_xp(experiment_id: str) -> int:
    experiment = get_science_experiment(experiment_id)
    return int(experiment["xp_reward"]) if experiment else 0


def get_science_topic(topic_id: str) -> dict | None:
    return next((topic for topic in SCIENCE_TOPICS if topic["id"] == topic_id), None)


def get_science_topic_experiments(topic_id: str) -> list[dict]:
    return [
        experiment
        for experiment in SCIENCE_EXPERIMENTS
        if experiment["topic_id"] == topic_id
    ]


def is_science_topic_complete(
    topic_id: str,
    completed_experiment_ids: list[str] | set[str],
) -> bool:
    topic_experiments = get_science_topic_experiments(topic_id)
    completed_ids = set(completed_experiment_ids)

    return bool(topic_experiments) and all(
        experiment["id"] in completed_ids for experiment in topic_experiments
    )


def get_completed_science_topics(
    completed_experiment_ids: list[str] | set[str],
) -> list[dict]:
    return [
        topic
        for topic in SCIENCE_TOPICS
        if is_science_topic_complete(topic["id"], completed_experiment_ids)
    ]


def validate_science_registry(
    topics: list[dict] | None = None,
    experiments: list[dict] | None = None,
) -> list[str]:
    topics = topics if topics is not None else SCIENCE_TOPICS
    experiments = experiments if experiments is not None else SCIENCE_EXPERIMENTS
    errors: list[str] = []

    topic_ids = [topic.get("id") for topic in topics]
    duplicate_topic_ids = {
        topic_id for topic_id in topic_ids if topic_id and topic_ids.count(topic_id) > 1
    }
    for topic_id in sorted(duplicate_topic_ids):
        errors.append(f'topic "{topic_id}": duplicate topic id.')

    known_topic_ids = {topic_id for topic_id in topic_ids if topic_id}
    experiment_ids = [experiment.get("id") for experiment in experiments]
    duplicate_experiment_ids = {
        experiment_id
        for experiment_id in experiment_ids
        if experiment_id and experiment_ids.count(experiment_id) > 1
    }
    for experiment_id in sorted(duplicate_experiment_ids):
        errors.append(f'experiment "{experiment_id}": duplicate experiment id.')

    experiments_by_id = {
        experiment.get("id"): experiment
        for experiment in experiments
        if experiment.get("id")
    }
    experiments_by_topic: dict[str, list[dict]] = {}

    for experiment in experiments:
        experiment_id = experiment.get("id", "<missing-id>")
        topic_id = experiment.get("topic_id")
        activity_type = experiment.get("activity_type")
        xp_reward = experiment.get("xp_reward", 0)

        if topic_id not in known_topic_ids:
            errors.append(
                f'experiment "{experiment_id}": unknown topic id "{topic_id}".'
            )
        else:
            experiments_by_topic.setdefault(topic_id, []).append(experiment)

        if activity_type not in SUPPORTED_SCIENCE_ACTIVITY_TYPES:
            errors.append(
                f'experiment "{experiment_id}": invalid activity type "{activity_type}".'
            )

        if not isinstance(xp_reward, int) or xp_reward <= 0:
            errors.append(
                f'experiment "{experiment_id}": xp reward must be greater than zero.'
            )

        required_id = experiment.get("requires")
        if required_id is None:
            continue

        required_experiment = experiments_by_id.get(required_id)
        if required_experiment is None:
            errors.append(
                f'experiment "{experiment_id}": prerequisite "{required_id}" does not exist.'
            )
            continue

        if required_experiment.get("topic_id") != topic_id:
            errors.append(
                f'experiment "{experiment_id}": prerequisite "{required_id}" belongs to another topic.'
            )

    for topic_id, topic_experiments in experiments_by_topic.items():
        orders = [experiment.get("order") for experiment in topic_experiments]
        duplicate_orders = {
            order for order in orders if order is not None and orders.count(order) > 1
        }

        for order in sorted(duplicate_orders):
            errors.append(
                f'topic "{topic_id}": duplicate mission order "{order}".'
            )

        ordered_experiments = sorted(
            topic_experiments,
            key=lambda experiment: experiment.get("order", 0),
        )

        for index, experiment in enumerate(ordered_experiments):
            experiment_id = experiment.get("id", "<missing-id>")
            expected_order = index + 1

            if experiment.get("order") != expected_order:
                errors.append(
                    f'experiment "{experiment_id}": expected order {expected_order} in topic "{topic_id}".'
                )

            if index == 0:
                if experiment.get("requires") is not None:
                    errors.append(
                        f'experiment "{experiment_id}": first mission in topic "{topic_id}" must not have a prerequisite.'
                    )
                continue

            expected_required_id = ordered_experiments[index - 1].get("id")
            if experiment.get("requires") != expected_required_id:
                errors.append(
                    f'experiment "{experiment_id}": expected prerequisite "{expected_required_id}".'
                )

    for experiment in experiments:
        seen: set[str] = set()
        current = experiment

        while current.get("requires") is not None:
            current_id = current.get("id")
            required_id = current.get("requires")

            if required_id in seen or required_id == current_id:
                errors.append(
                    f'experiment "{experiment.get("id", "<missing-id>")}": circular prerequisite chain.'
                )
                break

            seen.add(current_id)
            current = experiments_by_id.get(required_id)
            if current is None:
                break

    return errors
