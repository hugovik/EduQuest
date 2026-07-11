# Sprint 9.10 — Science Lab Stabilization Audit

## Summary

Science Lab now supports Electricity and Magnetism with topic-local progression, backend-owned mission completion, backend-owned topic rewards, shared achievements, backend-validated review scoring, persisted review attempts, and mastery summaries.

Sprint 9.10 reviewed the Science stack for release readiness and made one small stabilization fix: Science topic accordion headers now expose `aria-expanded` and `aria-controls`.

## Architecture Reviewed

Backend:

- `backend/app/content/science_registry.py`
- `backend/app/content/science_review_registry.py`
- `backend/app/api/science_routes.py`
- `backend/app/models/science_progress.py`
- `backend/app/models/science_review_attempt.py`
- `backend/app/schemas/science.py`
- `backend/app/services/science_service.py`
- `backend/tests/test_science_progress.py`
- `backend/tests/test_science_registry.py`

Frontend:

- `frontend/src/api/scienceApi.js`
- `frontend/src/features/science/ScienceLabPage.jsx`
- `frontend/src/features/science/components/ScienceAdventure.jsx`
- `frontend/src/features/science/components/ScienceTopicReview.jsx`
- `frontend/src/features/science/scienceExperiments.js`
- `frontend/src/features/science/scienceLessons.js`
- `frontend/src/features/science/scienceTopics.js`
- `frontend/src/features/science/utils/buildScienceExperiments.js`
- `frontend/src/features/science/utils/validateScienceContent.js`
- `frontend/src/features/lesson/components/*Activity.jsx`

## Confirmed Working Areas

- Official Science IDs are consistent: `electricity-1` through `electricity-5` and `magnets-1` through `magnets-5`.
- Magnetism does not require Electricity completion.
- Topic-local unlock rules are defined in the backend registry and respected by frontend build helpers.
- Backend awards Science XP once per mission.
- Repeated mission completion returns zero XP and does not duplicate progress events.
- Topic rewards use shared inventory and are granted once.
- Topic achievements use the shared achievement system.
- Review scoring is backend-calculated from submitted answers.
- Review attempts persist, track best score, and report mastery.
- Reviews award zero XP and do not duplicate rewards or achievements.
- Frontend activities now emit normalized submitted answers for review scoring.
- Science progress response includes topic summaries and review summaries.
- Developer reset includes Science progress and review attempts.

## Issues Found

### Fixed

- Science topic accordion buttons did not expose expanded state to assistive technology.
  - Added `aria-expanded`.
  - Added `aria-controls`.
  - Added a frontend source test guard.

### Remaining

- `frontend/src/features/science/scienceStorage.js` appears obsolete and unused after backend-backed Science progress. It should be removed in a cleanup sprint if no older dev tools still rely on it.
- `ScienceLabPage.jsx` is growing large and now owns loading, grouping, topic rendering, mission cards, and review entry wiring. It is still readable, but extraction would help before adding the next topic.
- `ScienceTopicReview.jsx` uses `JSON.stringify()` for correct-answer display. This is acceptable for stabilization but should become child-friendlier before a parent/player polish pass.
- Review answer keys intentionally duplicate minimal answer data from frontend activities. This is the current architecture tradeoff until content generation or a shared content build step exists.
- Current repository also contains unrelated Treehouse Sprint 10 changes in the working tree. They were not part of the Science audit.

## Security And Source Of Truth

Backend owns:

- Official mission IDs
- Topic membership
- Activity type
- Mission order and prerequisites
- XP rewards
- Completion state
- Topic rewards and achievements
- Review answer keys
- Review scoring and mastery

Frontend owns:

- Presentation copy
- Visual mission content
- Activity UI
- Professor Nova messages
- Review explanations

No frontend-submitted correctness or score is trusted for persisted Science review scoring.

## Test Results

Executed during Sprint 9.10:

- Backend full suite: `158 passed`
- Frontend test runner: `21 frontend test suites passed`
- Frontend production build: passed
- `git diff --check`: passed with line-ending warnings only

Known warnings:

- Existing SQLAlchemy/Python `datetime.utcnow()` deprecation warnings remain.
- Existing pytest cache warning appears in this Windows environment.
- Git reports CRLF/LF normalization warnings.

## Manual QA Notes

Manual browser QA was not performed in this pass. The implementation was validated with backend service tests, frontend source/API tests, and production build.

Recommended manual QA before merge:

- Complete Electricity from a clean reset.
- Confirm Lightning Crystal is granted once.
- Complete Magnetism without completing Electricity.
- Confirm Magnetic Compass is granted once.
- Run a mixed-score review and confirm backend score/mastery.
- Replay final missions and reviews to confirm zero duplicate XP/rewards.

## Remaining Technical Debt

### P0 – Blocks Release

- None found in automated checks.

### P1 – Should Fix Soon

- Remove unused `scienceStorage.js` after confirming no dev dashboard import path depends on it.
- Extract Science topic accordion/card rendering from `ScienceLabPage.jsx`.
- Improve review result answer formatting for child-friendly display.
- Add browser-level smoke tests when the project has a real UI test harness.

### P2 – Future Cleanup

- Replace minimal duplicated review answer keys with a generated/shared content validation pipeline.
- Introduce repository wrapper for `ScienceReviewAttempt` if Science review behavior grows.
- Replace `datetime.utcnow()` usage with timezone-aware UTC timestamps.
- Expand Science architecture docs with diagrams once more topics are added.

## Files Changed In Sprint 9.10

- `frontend/src/features/science/ScienceLabPage.jsx`
- `frontend/src/features/science/scienceLessons.test.js`
- `docs/03-Architecture/Science_Lab.md`
- `docs/audits/Sprint_9_10_Science_Audit.md`

This audit report also includes findings from Sprint 9.9 files currently in the working tree.

## Recommended Next Sprint

Before adding Plants, Weather, Space, or Human Body:

1. Remove obsolete local Science storage.
2. Extract `ScienceTopicAccordion` and `ScienceExperimentCard`.
3. Improve review results formatting.
4. Add manual QA notes to the release checklist.
5. Then add the next Science topic using the checklist in `docs/03-Architecture/Science_Lab.md`.
