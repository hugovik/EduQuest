# Treehouse Visual Assets

Sprint 10.2 integrates safe artwork crops from the supplied concept sheet while preserving real React controls, text, XP values, quest data, and navigation.

## Integrated Assets

These files are currently imported by `frontend/src/features/treehouse/treehouseAssets.js`:

- `backgrounds/treehouse-scene-desktop.jpg` — 228x390, central treehouse crop for desktop.
- `backgrounds/treehouse-scene-tablet.jpg` — 210x370, tighter central treehouse crop for tablet.
- `backgrounds/treehouse-scene-mobile.jpg` — 178x340, tighter central treehouse crop for phone layouts.
- `characters/professor-owl.jpg` — 180x170, Professor Owl crop.
- `characters/spark-dragon.jpg` — 105x122, Spark Dragon crop.
- `growth/tree-growth-world.jpg` — 165x180, World Tree growth-stage crop.

The scene, character, and growth components all retain CSS or emoji fallbacks. If an image fails to load, the Treehouse layout, text, controls, and navigation still render.

## Reference

- `reference/treehouse-concept.png` — 1536x1024, 2.6 MB concept sheet.

This reference includes baked-in labels, buttons, quest copy, XP values, and UI mockups. It must not be used as a full-screen functional background. The current integrated assets are neutral crops that avoid duplicated fake controls as much as possible.

## Remaining Production Tasks

- Replace JPG crops with optimized WebP exports.
- Replace character crops with transparent-background character layers.
- Add stage-specific transparent growth assets for Sapling, Young Tree, Growing Tree, and Great Tree.
- Add optional transparent overlays for foreground leaves, lantern glow, and atmospheric light.
- Add optional subtle `parchment-panel.webp` and `wooden-panel.webp` textures only if they preserve text contrast.
- Add mood variants for Spark Dragon, such as cheerful, excited, proud, curious, and resting.

## Asset Guidelines

- Prefer WebP for production artwork.
- Character and foreground assets should have transparent backgrounds.
- Avoid oversized transparent canvases and unused margins.
- Keep mobile variants separate so phones do not download the full desktop scene.
- Do not bake functional labels, quest text, XP values, or navigation into artwork.
- Keep artwork decorative or illustrative; gameplay data must remain React-rendered.

## Interactive Objects

Sprint 10.3 adds a reusable Treehouse object layer in `frontend/src/features/treehouse/treehouseInteractions.js`.

Current object IDs:

- `world-map` — interactive compass/map entry point for the existing World Map.
- `inventory` — backpack entry point that points to the existing inventory experience.
- `daily-quest` — quest parchment entry point for today's quest information.
- `tree-growth` — Tree of Growth entry point for existing growth and XP data.
- `professor-owl` — mentor dialogue entry point.
- `spark-dragon` — companion reaction entry point.
- `settings` — settings/developer entry point when available.

Desktop uses scene hotspots and interactive wrappers around visible Treehouse panels. Mobile uses explicit tappable object cards instead of reproducing the desktop hotspot map. Decorative artwork remains noninteractive unless wrapped by one of these object controls.

Future constructed subject shortcuts should reuse this same object architecture. They are intentionally not part of Sprint 10.3, and the Treehouse should still send players through the World Map instead of direct subject portals.

## Treehouse Shortcuts

Sprint 10.4 introduces Treehouse Shortcuts as earned convenience features. A shortcut does not replace the World Map; it adds a direct route only after the player has restored enough of a region and completed construction.

Pilot shortcut:

- `reading-forest-shortcut` — an enchanted bookshelf / reading nook for Reading Forest.

Backend source of truth:

- Registry: `backend/app/content/treehouse_shortcut_registry.py`
- Service: `backend/app/services/treehouse_shortcut_service.py`
- API: `GET /treehouse/shortcuts`, `GET /treehouse/shortcuts/{shortcut_id}`, `POST /treehouse/shortcuts/{shortcut_id}/contribute`

Reading Forest pilot rules:

- Locked until 3 Reading Forest passages are completed.
- Stage 1 to 2 requires 3 passages and 1 Reading Leaf.
- Stage 2 to 3 requires 5 passages and 1 Reading Leaf.
- Stage 3 to 4 requires 8 passages and 2 Reading Leaves.
- Completed Stage 4 unlocks direct Treehouse to Reading Forest navigation.

Construction resource:

- `reading_leaf`, an existing Reading Forest inventory item, is reused as the construction material.

The frontend renders backend fields such as `eligible`, `can_contribute`, `current_progress`, `required_progress`, and `owned_resource_quantity`. It must not recalculate construction eligibility or mutate shortcut stages directly.

Future Math, Writing, Science, and other region shortcuts should add registry entries and use the same service/API/panel flow rather than adding direct subject buttons to the Treehouse.
