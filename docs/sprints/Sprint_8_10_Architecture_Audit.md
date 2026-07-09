# Sprint 8.10 — Architecture & Technical Debt Audit

## Executive Summary

EduQuest is functionally stable after Sprint 8.9: backend tests pass, frontend smoke tests pass, and the frontend production build succeeds. Science Lab now has backend XP/progress integration, and Tree House/global XP can reflect Science completion through the backend child profile.

The main architectural risk is not a failing test; it is drift. Math, Reading, Writing, and Science now use different persistence and reward paths. Adventure metadata also exists in multiple places across frontend and backend. The project is ready for Sprint 9, but the next stabilization sprint should focus on unifying progress, reward, and adventure contracts before adding more region complexity.

Validation results:
- Backend: `.\.venv\Scripts\python.exe -m pytest backend/tests` → `113 passed`
- Frontend smoke tests: `npm test` → `15 frontend test suites passed`
- Frontend build: `npm run build` → passed
- Diff hygiene: `git diff --check` → passed, with Windows line-ending warnings only

## Current Architecture Snapshot

Backend:
- FastAPI routes live under `backend/app/api`.
- SQLAlchemy models live under `backend/app/models`.
- Services orchestrate most gameplay workflows under `backend/app/services`.
- Repositories exist for older/shared systems, but newer Science progress currently uses direct SQLAlchemy queries in `ScienceService`.
- `QuestService` still powers Math quest completion and legacy quest progress.
- `ReadingService` owns Reading Forest passage, story, reward, and progress logic.
- `ScienceService` now owns Science experiment completion and XP integration.
- `AdventureProgressSummaryService`, `AdventureUnlockService`, `AdventureService`, and `WorldService` provide global adventure/world summaries.

Frontend:
- App navigation is screen-state based in `frontend/src/App.jsx`, not React Router.
- Adventure pages are registered in `frontend/src/features/adventure/adventurePages.js`.
- Adventure metadata is registered in `frontend/src/features/adventure/adventureRegistry.js`.
- World Map uses backend world state when available and frontend `worldRegionConfig.js` as fallback.
- Shared lesson rendering is centralized in `frontend/src/features/lesson/components/ActivityRenderer.jsx`.
- Shared layout pieces include `DashboardLayout`, `PageHeader`, `AdventureProgressCard`, `StatusBadge`, and `LessonRewardScene`.

## High-Priority Issues

1. Progress/reward logic is split across too many services.
   - Math: quest completion and reward paths.
   - Reading: direct XP application in `ReadingService`.
   - Science: direct XP application in `ScienceService`.
   - Writing: currently localStorage-only progress/XP.
   - Risk: future XP, daily goal, achievement, and tree growth changes must be manually replicated per adventure.

2. Writing Kingdom progress is still local-only.
   - Writing uses `frontend/src/features/writing/writingStorage.js` and does not currently update backend child XP.
   - Tree House/global XP will not reflect Writing completion until Writing gets a backend completion endpoint.

3. Adventure metadata is duplicated between frontend and backend.
   - Frontend: `adventureRegistry.js`, `adventureUnlockConfig.js`, `worldRegionConfig.js`.
   - Backend: `AdventureService.ADVENTURE_REGISTRY`, `AdventureUnlockService.WORLD_REGION_RULES`.
   - Risk: playable/coming-soon states can drift. Tests already needed updates after Writing/Science became playable.

4. Lesson activity contract is not fully normalized.
   - Required target contract is `<Activity lesson={lesson} onComplete={...} />`.
   - Writing activities follow `lesson`.
   - New Science `MatchingActivity`, `SequencingActivity`, and `PredictionActivity` follow `lesson`.
   - `ObservationActivity` and `ClassificationActivity` use `activity`.
   - `ActivityRenderer` bridges the mismatch, but component-level reuse is inconsistent.

5. Achievement systems are split.
   - Backend has achievement models/services/endpoints.
   - Science UI still uses localStorage achievement helpers and `AchievementToast`.
   - Developer Dashboard shows local achievement state, not backend achievement state.
   - Risk: badge display and backend truth diverge.

## Medium-Priority Issues

1. Science lesson XP is duplicated.
   - Frontend Science lesson XP lives in `frontend/src/features/science/scienceLessons.js`.
   - Backend Science XP lives in `backend/app/services/science_service.py`.
   - Risk: changing XP in one place produces mismatched UI/reward behavior.

2. World progress summary is not fully generic.
   - `WorldService.get_progress_summary()` returns `math` and `reading`, while region list now includes Writing and Science.
   - World Map region cards can show Science through `progress_summary`, but parent-facing world summary remains narrower than the playable adventure list.

3. Reading and Science progress models are adventure-specific.
   - This is acceptable now, but the shape should converge before Geography/Music.
   - A normalized `AdventureActivityProgress` pattern would reduce one-off services.

4. Dev reset must remain manually synchronized.
   - `POST /dev/reset-progress` correctly includes `ScienceProgress` now.
   - AGENTS.md explicitly warns that new player-owned persistence must update this endpoint and its regression test.
   - Risk remains as new adventure tables are added.

5. Frontend cache invalidation is spread across hooks/components.
   - Reading hook invalidates many global keys.
   - Science completion invalidates keys inside `ScienceAdventure`.
   - Math reward hook invalidates its own set.
   - A shared `invalidateGlobalProgress()` helper would reduce misses.

## Low-Priority Cleanup

1. Several docs still use older names or states.
   - Examples: Writing Castle vs Writing Kingdom, Science coming soon in Sprint 6 docs.

2. CSS is large and mixed.
   - `frontend/src/styles.css` is over 1,500 lines.
   - It imports `theme/cards.css`, but most layout, adventure, activity, Writing, and Science styles remain in one file.

3. Some frontend tests use mocked payloads with stale labels.
   - Example: `worldApi.test.js` still contains a mocked Writing coming-soon region even though current product state makes Writing playable.

4. Some components are likely generic but live under adventure-specific folders.
   - `ProfessorNovaPanel` is Science-specific today but structurally a generic character/dialogue panel.
   - `WritingBookProgress`, `WritingStoryProgress`, and Science topic progress patterns could inform shared progress components later.

## Backend XP / Progress Findings

Confirmed working:
- Math quest duplicate completion is blocked through `QuestService.complete_quest()`.
- Reading completed passage replay returns duplicate state and does not award XP again.
- Science experiment replay returns `already_completed: true` and `xp_awarded: 0`.
- Science completion now updates `Child.xp`, level, tree stage, `ScienceProgress`, `ProgressEvent`, and `TreeGrowthEvent`.
- Adventure progress summary now includes Science XP and completion counts.
- XP audit now includes `science_experiment_xp`.
- Dev reset clears `ScienceProgress`.

Risks:
- XP application is duplicated in `QuestService`, `ReadingService`, `ScienceService`, `WorldQuestService`, and achievement bonus code.
- Science does not yet integrate with backend daily goals or backend achievements.
- Writing does not yet have backend XP/progress persistence.
- Science progress service uses direct SQLAlchemy queries rather than a repository.
- Backend Science experiment definitions duplicate frontend lesson data.

## Frontend Architecture Findings

Confirmed working:
- `App.jsx` supports Tree House, World Map, Math, Reading, Writing, Science, and dev dashboard screen states.
- `adventurePages.js` maps Math, Reading, Writing, and Science to pages.
- World Map uses backend `worldState.regions` when present and frontend registry fallback when not.
- Science completion now calls backend completion and invalidates player/progress/world queries.

Risks:
- Adventure state exists in several parallel configs.
- Science and Writing still keep localStorage progress for UI. Science is now backed by the backend, but Writing is not.
- `ScienceLabPage` merges backend and local progress, which is a practical bridge but should not become the long-term pattern for every adventure.
- Navigation is simple and workable, but hardcoded location strings appear in `App.jsx`, `worldLocation.js`, `WorldMapPage.jsx`, backend `WorldService`, and backend unlock rules.

## Lesson Engine Findings

Activity types reviewed:
- `observation`
- `classification`
- `matching`
- `sequencing`
- `prediction`
- `missing-punctuation`
- `missing-capital`
- `missing-word`
- `sentence-ordering`
- `grammar-choice`

Findings:
- `ActivityRenderer` centralizes activity selection.
- Writing activities accept `{ lesson, onComplete }`.
- `MatchingActivity`, `SequencingActivity`, and `PredictionActivity` accept `{ lesson, onComplete }`.
- `ObservationActivity` and `ClassificationActivity` accept `{ activity, onComplete }`.
- Completion payloads vary. Some return `{ correct }`; Writing activities return `{ xp, correct }`.
- Incorrect feedback varies: some use inline messages, while Matching/Sequencing/Prediction currently use `alert()`.

Recommended contract:
- All activity components should accept `{ lesson, onComplete }`.
- All completion callbacks should return a normalized object such as `{ correct, score, attempts, xpRequested }`.
- Feedback should be rendered in-app, not through browser alerts.

## Achievement System Findings

Confirmed working:
- Backend achievement tests pass.
- Backend achievement unlocks are protected from duplicates.
- Local Science achievement unlocks also protect duplicates through localStorage.
- Developer Dashboard can reset local achievement storage.

Risks:
- Backend and frontend/local achievements are separate systems.
- Science achievements are local-only.
- Developer Dashboard does not display backend earned achievements.
- Export/import currently covers local storage snapshots, not backend achievements.
- Achievement toast is frontend-local and not driven by backend evaluation responses for Science.

## CSS / UI Findings

Confirmed working:
- Shared layout and page components are in active use.
- World Map, Tree House, Writing, and Science have dedicated visual sections.
- Production build succeeds.

Risks:
- `frontend/src/styles.css` is approximately 1,555 lines and mixes global layout, world map, reading, writing, science, activities, cards, forms, and dev dashboard styles.
- Science-specific styles include generic activity classes such as `.activity-card` and `.activity-options`.
- Button/card/progress patterns are repeated across Reading, Writing, Science, World, and Tree House.
- Some styles are adventure-specific but likely should become theme-level utilities.

Recommended future split:
- `theme/layout.css`
- `theme/cards.css`
- `theme/buttons.css`
- `theme/badges.css`
- `theme/forms.css`
- `theme/activities.css`
- `theme/adventures.css`

## Test Coverage Findings

Confirmed passing:
- Backend: 113 tests passing.
- Frontend smoke tests: 15 suites passing.
- Frontend build passing.

Strong coverage:
- Quest duplicate completion.
- Reading replay/no duplicate XP.
- Science XP once-only.
- Dev reset clears player-owned progress.
- Adventure unlock current states.
- World state/travel behavior.
- XP audit reconciliation.

Missing or thin coverage:
- Frontend ScienceAdventure backend completion flow is not component-tested.
- Writing backend/global XP behavior is not covered because it does not exist yet.
- Activity component contract consistency is not tested.
- Backend Science route-level tests are indirect through service tests.
- Backend achievements are tested, but local Science achievement behavior is only indirectly protected.
- CSS/layout regressions are not visually tested.

## Documentation Gaps

Docs needing updates:
- `docs/03-Architecture/System_Architecture.md`
- `docs/03-Architecture/Backend.md`
- `docs/03-Architecture/Frontend.md`
- `docs/03-Architecture/Database.md`
- `docs/03-Architecture/Project_Structure.md`
- `docs/02-Product/Achievements.md`
- `docs/02-Product/Progression_System.md`
- `docs/02-Product/Worlds.md`
- `docs/06-Roadmap/Changelog.md`
- `docs/ROADMAP.md`
- `docs/PROJECT_STATUS.md`
- `docs/sprints/Sprint_6_World_Engine.md`

Specific stale areas:
- Some docs still describe Writing/Science as future or coming soon.
- Some docs still use older naming such as Writing Castle.
- There is no current dedicated Lesson Engine doc.
- There is no current Science Lab architecture/progress doc.
- Progress/XP documentation does not yet describe ScienceProgress or backend/local hybrid progress.

## Recommended Cleanup Backlog

### P0 — Must fix before Sprint 9

1. Decide the source of truth for Writing progress and XP.
   - If Writing remains playable, it should get backend completion support before more Writing content is added.

2. Normalize the lesson activity interface.
   - Convert `ObservationActivity` and `ClassificationActivity` to accept `lesson`.
   - Standardize completion payloads across all activities.

3. Consolidate global progress invalidation.
   - Add one frontend helper/hook for invalidating player, world, adventure, achievement, daily goal, and progress summary query keys after any adventure completion.

4. Move Science XP definitions to one source of truth.
   - Prefer backend-owned lesson/experiment config or a shared generated/static config consumed consistently.

### P1 — Should fix during Sprint 9

1. Introduce a shared backend adventure completion/reward service.
   - Centralize XP, level, tree growth, progress event, replay handling, daily goals, and achievements.

2. Add backend repository for Science progress.
   - Align Science with the repository pattern used elsewhere.

3. Make `WorldService.get_progress_summary()` include all playable adventures.
   - Include Writing and Science alongside Math and Reading.

4. Unify adventure metadata.
   - Either generate frontend registry from backend metadata or keep a single shared JSON source.

5. Convert Science achievements to backend-backed achievements.
   - Keep local toast display, but drive earned badge state from backend.

6. Add frontend component tests or richer smoke tests for Science completion.

### P2 — Nice cleanup later

1. Split `styles.css` into theme modules.
2. Move generic activity styles out of Science sections.
3. Replace `alert()` feedback in lesson activities with in-app feedback panels.
4. Rename remaining Geography Harbor/Music Meadow labels if product naming has settled on Geography Island/Music Valley.
5. Add a visual QA checklist for World Map, Tree House, Science, and Writing.
6. Update historical sprint docs with a short “superseded by Sprint X” note instead of rewriting old history.

## Suggested Sprint 8.11 Stabilization Plan

1. Freeze new gameplay feature work for one sprint.
2. Add backend Writing progress/XP completion with duplicate protection.
3. Extract shared backend reward/progress helper used by Reading, Science, and future Writing.
4. Normalize lesson activity props and completion payloads.
5. Replace Science local achievement unlocks with backend evaluation, keeping the same toast UI.
6. Update World Progress Summary to include all playable adventures.
7. Start CSS split with only low-risk moves: buttons, cards, activities.
8. Update docs for current playable region state and progress architecture.

## Files Reviewed

Backend:
- `backend/app/api/achievement_routes.py`
- `backend/app/api/adventure_routes.py`
- `backend/app/api/child_routes.py`
- `backend/app/api/dev_routes.py`
- `backend/app/api/quest_routes.py`
- `backend/app/api/reading_routes.py`
- `backend/app/api/science_routes.py`
- `backend/app/api/world_routes.py`
- `backend/app/core/dependencies.py`
- `backend/app/main.py`
- `backend/app/models/child.py`
- `backend/app/models/progress_event.py`
- `backend/app/models/quest_completion.py`
- `backend/app/models/reading_progress.py`
- `backend/app/models/science_progress.py`
- `backend/app/models/tree_growth_event.py`
- `backend/app/services/adventure_progress_summary_service.py`
- `backend/app/services/adventure_service.py`
- `backend/app/services/adventure_unlock_service.py`
- `backend/app/services/achievement_service.py`
- `backend/app/services/quest_service.py`
- `backend/app/services/reading_service.py`
- `backend/app/services/reward_service.py`
- `backend/app/services/science_service.py`
- `backend/app/services/world_service.py`
- `backend/app/services/xp_audit_service.py`
- `backend/tests/test_adventure_service.py`
- `backend/tests/test_adventure_unlocks.py`
- `backend/tests/test_dev_reset_progress.py`
- `backend/tests/test_quest_completion.py`
- `backend/tests/test_reading_forest.py`
- `backend/tests/test_science_progress.py`
- `backend/tests/test_world_state.py`
- `backend/tests/test_xp_audit.py`

Frontend:
- `frontend/src/App.jsx`
- `frontend/src/api/scienceApi.js`
- `frontend/src/api/queryKeys.js`
- `frontend/src/components/DashboardLayout.jsx`
- `frontend/src/components/PageHeader.jsx`
- `frontend/src/features/adventure/adventurePages.js`
- `frontend/src/features/adventure/adventureRegistry.js`
- `frontend/src/features/adventure/adventureUnlockConfig.js`
- `frontend/src/features/achievements/achievements.js`
- `frontend/src/features/achievements/achievementService.js`
- `frontend/src/features/achievements/AchievementToast.jsx`
- `frontend/src/features/lesson/components/ActivityRenderer.jsx`
- `frontend/src/features/lesson/components/ClassificationActivity.jsx`
- `frontend/src/features/lesson/components/GrammarChoiceActivity.jsx`
- `frontend/src/features/lesson/components/MatchingActivity.jsx`
- `frontend/src/features/lesson/components/MissingCapitalActivity.jsx`
- `frontend/src/features/lesson/components/MissingPunctuationActivity.jsx`
- `frontend/src/features/lesson/components/MissingWordActivity.jsx`
- `frontend/src/features/lesson/components/ObservationActivity.jsx`
- `frontend/src/features/lesson/components/PredictionActivity.jsx`
- `frontend/src/features/lesson/components/SentenceOrderingActivity.jsx`
- `frontend/src/features/lesson/components/SequencingActivity.jsx`
- `frontend/src/features/progress/progressService.js`
- `frontend/src/features/science/ScienceLabPage.jsx`
- `frontend/src/features/science/components/ScienceAdventure.jsx`
- `frontend/src/features/science/scienceLessons.js`
- `frontend/src/features/science/scienceExperiments.js`
- `frontend/src/features/science/scienceStorage.js`
- `frontend/src/features/storage/storageKeys.js`
- `frontend/src/features/storage/storageService.js`
- `frontend/src/features/treehouse/TreeHouseDashboard.jsx`
- `frontend/src/features/world/WorldMapPage.jsx`
- `frontend/src/features/world/worldLocation.js`
- `frontend/src/features/world/worldRegionConfig.js`
- `frontend/src/features/writing/WritingKingdomPage.jsx`
- `frontend/src/features/writing/components/WritingAdventure.jsx`
- `frontend/src/features/writing/writingStorage.js`
- `frontend/src/styles.css`

Documentation:
- `docs/AGENTS.md`
- `docs/ENGINEERING.md`
- `docs/PROJECT_STATUS.md`
- `docs/ROADMAP.md`
- `docs/03-Architecture/*`
- `docs/06-Roadmap/Changelog.md`
- `docs/sprints/Sprint_6_World_Engine.md`
