# Sprint 8.11 — Core Engine Unification

## Summary

Sprint 8.11 stabilized the core EduQuest engine before Sprint 9. The work focused on backend-backed Writing progress, a shared completion helper for new adventure completions, backend-backed Science achievement unlocks, normalized lesson activity props, and consistent global progress reporting for all currently playable adventures.

Playable adventures after this sprint:
- Math Mountains
- Reading Forest
- Writing Kingdom
- Science Lab

Coming Soon regions remain:
- Geography Island / Geography Harbor naming still needs final product cleanup
- Music Valley / Music Meadow naming still needs final product cleanup

## Backend Completion Flow

New backend Writing completion support:
- `POST /writing/lessons/{lesson_id}/complete`
- `GET /writing/progress`

Writing lesson completion now:
- persists `WritingProgress`
- awards XP once only
- allows replay/review with `xp_awarded: 0`
- updates `Child.xp`, level, and tree stage
- creates `ProgressEvent`
- creates `TreeGrowthEvent`
- appears in adventure/global progress summaries
- is cleared by `POST /dev/reset-progress`

Science completion now uses the shared completion helper for XP, progress event, and tree growth event creation. Math and Reading still use legacy completion paths and should be migrated only when it is safe to do so.

## Shared Completion Helper

Added `AdventureCompletionService` as a small, safe extraction point for shared adventure completion behavior.

Currently used by:
- Science Lab
- Writing Kingdom

Centralized behavior:
- apply XP to child
- recalculate level
- recalculate tree stage
- create `ProgressEvent`
- create `TreeGrowthEvent`

Known remaining legacy paths:
- `QuestService.complete_quest()`
- `ReadingService.submit_answers()`
- `WorldQuestService.evaluate_restore_quest()`
- achievement XP bonus application

## Lesson Activity Contract

All lesson activity components now use the same prop shape:

```jsx
<Activity lesson={lesson} onComplete={onComplete} />
```

Completion payloads now follow the normalized shape:

```js
{
  correct: true,
  score: 1,
  attempts: 1,
  xpRequested: 5
}
```

The lesson engine still contains some different feedback patterns, including browser `alert()` usage in several Science activities. That should be cleaned up later without changing the completion contract.

## Achievement Source Of Truth

Science first-experiment achievement unlocks are now evaluated by the backend through `AchievementService`.

Science completion responses include:
- `achievements_unlocked`

The frontend still displays the existing `AchievementToast`, but the data now comes from the backend completion response. Local-only achievement helpers remain in the Developer Dashboard and should be migrated or clearly labeled in a later stabilization pass.

## Global Progress

Global progress now includes all playable adventures:
- Math
- Reading
- Writing
- Science

Updated areas:
- Adventure progress summary
- World progress summary
- XP audit
- Dev reset

Frontend completion flows now share `invalidateGlobalProgress()` for common React Query invalidation after Science/Writing completion.

## Tests

Added or updated coverage for:
- Writing completion awards XP once
- Writing replay does not award XP again
- Writing appears in adventure progress
- Dev reset clears Writing progress
- Science first-experiment achievement unlocks once
- Activity contract normalization
- Writing API smoke behavior

Validation results:
- Backend tests: `117 passed`
- Frontend smoke tests: `17 frontend test suites passed`
- Frontend production build: passed
- `git diff --check`: passed with Windows line-ending warnings only

## Remaining Risks

- Math and Reading still use legacy reward/completion paths.
- Writing lesson XP is duplicated between frontend lesson data and backend Writing lesson config.
- Science experiment XP is duplicated between frontend lesson data and backend Science experiment config.
- Backend achievement state and local Developer Dashboard achievement state are not fully unified.
- Adventure metadata still exists in frontend and backend sources, though tests now cover the current playable state.
- CSS remains largely centralized in `frontend/src/styles.css`.

## Recommended Next Sprint

Sprint 8.12 or Sprint 9 should focus on one of these:

1. Migrate Reading or Math onto the shared completion helper.
2. Move adventure lesson definitions toward a backend-owned or shared static source.
3. Replace local achievement storage in the Developer Dashboard with backend achievement state.
4. Expand component/smoke tests for Science and Writing completion flows.
