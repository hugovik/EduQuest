# Treehouse Visual Assets

Sprint 10.2 integrates safe artwork crops from the supplied concept sheet while preserving real React controls, text, XP values, quest data, and navigation.

## Integrated Assets

These files are currently imported by `frontend/src/features/treehouse/treehouseAssets.js`:

- `backgrounds/treehouse-scene-desktop.png` — 228x390, central treehouse crop for desktop.
- `backgrounds/treehouse-scene-tablet.png` — 210x370, tighter central treehouse crop for tablet.
- `backgrounds/treehouse-scene-mobile.png` — 178x340, tighter central treehouse crop for phone layouts.
- `characters/professor-owl.png` — 180x170, Professor Owl crop.
- `characters/spark-dragon.png` — 105x122, Spark Dragon crop.
- `growth/tree-growth-world.png` — 165x180, World Tree growth-stage crop.

The scene, character, and growth components all retain CSS or emoji fallbacks. If an image fails to load, the Treehouse layout, text, controls, and navigation still render.

## Reference

- `reference/treehouse-concept.png` — 1536x1024, 2.6 MB concept sheet.

This reference includes baked-in labels, buttons, quest copy, XP values, and UI mockups. It must not be used as a full-screen functional background. The current integrated assets are neutral crops that avoid duplicated fake controls as much as possible.

## Remaining Production Tasks

- Replace PNG crops with optimized WebP exports.
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
