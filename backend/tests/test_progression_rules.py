import pytest

from app.services.progression_rules import (
    calculate_level_from_xp,
    calculate_tree_stage_from_xp,
    get_level_progress,
    get_next_growth_target,
)


@pytest.mark.parametrize(
    ("xp", "level", "tree_stage", "next_growth_target"),
    [
        (0, 1, "Seedling", 100),
        (99, 1, "Seedling", 100),
        (100, 2, "Sapling", 250),
        (249, 2, "Sapling", 250),
        (250, 3, "Young Tree", 450),
        (449, 3, "Young Tree", 450),
        (450, 4, "Growing Tree", None),
    ],
)
def test_progression_rules_for_xp_thresholds(xp, level, tree_stage, next_growth_target):
    assert calculate_level_from_xp(xp) == level
    assert calculate_tree_stage_from_xp(xp) == tree_stage
    assert get_next_growth_target(xp) == next_growth_target


@pytest.mark.parametrize(
    ("xp", "current_level_xp", "next_level_xp", "xp_progress_percent"),
    [
        (0, 0, 100, 0),
        (50, 0, 100, 50),
        (100, 100, 250, 0),
        (175, 100, 250, 50),
        (250, 250, 450, 0),
        (350, 250, 450, 50),
        (450, 450, None, 100),
    ],
)
def test_level_progress_uses_backend_thresholds(
    xp,
    current_level_xp,
    next_level_xp,
    xp_progress_percent,
):
    assert get_level_progress(xp) == {
        "current_level_xp": current_level_xp,
        "next_level_xp": next_level_xp,
        "xp_progress_percent": xp_progress_percent,
    }
