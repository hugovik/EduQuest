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


def get_level_progress(xp: int) -> dict[str, int | None]:
    current_level_xp = 0
    next_level_xp = get_next_growth_target(xp)

    for target in GROWTH_TARGETS:
        if xp >= target:
            current_level_xp = target

    if next_level_xp is None:
        return {
            "current_level_xp": current_level_xp,
            "next_level_xp": None,
            "xp_progress_percent": 100,
        }

    xp_range = next_level_xp - current_level_xp
    xp_progress_percent = 100
    if xp_range > 0:
        xp_progress_percent = min(
            100,
            max(0, round(((xp - current_level_xp) / xp_range) * 100)),
        )

    return {
        "current_level_xp": current_level_xp,
        "next_level_xp": next_level_xp,
        "xp_progress_percent": xp_progress_percent,
    }
