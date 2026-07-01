LEVEL_THRESHOLDS = [
    (450, 4),
    (250, 3),
    (100, 2),
    (0, 1),
]

TREE_STAGE_THRESHOLDS = [
    (450, "Growing Tree"),
    (250, "Young Tree"),
    (100, "Sapling"),
    (0, "Seedling"),
]

GROWTH_TARGETS = [100, 250, 450]


def calculate_level_from_xp(xp: int) -> int:
    for threshold, level in LEVEL_THRESHOLDS:
        if xp >= threshold:
            return level

    return 1


def calculate_tree_stage_from_xp(xp: int) -> str:
    for threshold, stage in TREE_STAGE_THRESHOLDS:
        if xp >= threshold:
            return stage

    return "Seedling"


def get_next_growth_target(xp: int) -> int | None:
    for target in GROWTH_TARGETS:
        if xp < target:
            return target

    return None
