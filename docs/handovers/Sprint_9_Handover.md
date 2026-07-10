# Sprint 9 Handover — Science Magnetism

## Completed Systems

- Electricity topic
- Magnetism topic
- Shared Science activities:
  - Observation
  - Classification
  - Matching
  - Sequencing
  - Prediction
- Backend Science registry
- Backend Science review answer registry
- Topic-local progression
- Mission completion pipeline
- Topic completion rewards
- Science achievements
- Review Mode
- Persisted review attempts
- Best score and mastery tracking
- Backend-validated review scoring

## Important Architecture

```txt
Backend registry
      ↓
Frontend rich content merge
      ↓
Mission Briefing
      ↓
Shared Activity Renderer
      ↓
Backend completion pipeline
      ↓
XP / progress / reward / achievement
```

Review flow:

```txt
Completed Science topic
      ↓
Shared Activity Renderer
      ↓
Frontend submits actual answers
      ↓
Backend validates answer keys
      ↓
Backend calculates score / mastery
      ↓
Persisted zero-XP review attempt
```

## Source-Of-Truth Boundaries

Backend owns:

- Official topic IDs
- Official mission IDs
- Topic membership
- Activity type
- Mission order
- Prerequisites
- XP rewards
- Progress
- Topic completion
- Rewards
- Achievements
- Review eligibility
- Review answer keys
- Review scoring
- Mastery

Frontend owns:

- Titles
- Descriptions
- Equipment display
- Introductions
- Learning objectives
- Vocabulary
- Fun facts
- Professor Nova messages
- Review explanations
- Activity presentation data
- Visual styling

## Important IDs

Electricity:

- `electricity-1`
- `electricity-2`
- `electricity-3`
- `electricity-4`
- `electricity-5`

Magnetism:

- `magnets-1`
- `magnets-2`
- `magnets-3`
- `magnets-4`
- `magnets-5`

Rewards:

- Electricity: `lightning_crystal`
- Magnetism: `magnetic_compass`

Achievements:

- Electricity: `science_electricity_master`
- Magnetism: `science_magnetism_master`

## Tests

Final verification for Sprint 9.11:

- Backend full suite: `158 passed`
- Frontend test runner: `21 frontend test suites passed`
- Frontend production build: passed
- `git diff --check`: passed with line-ending warnings only

Known warnings:

- Existing SQLAlchemy/Python `datetime.utcnow()` deprecation warnings.
- Existing pytest cache warning in the Windows environment.
- Git CRLF/LF normalization warnings.

## Known Technical Debt

### P1

- Remove unused `frontend/src/features/science/scienceStorage.js` after confirming no dev tooling relies on it.
- Extract `ScienceTopicAccordion` and `ScienceExperimentCard` before adding more Science topics.
- Improve review result answer formatting for child-friendly display.
- Add browser-level smoke tests when the project has a UI test harness.

### P2

- Replace minimal duplicated review answer keys with a generated or shared content validation pipeline.
- Introduce a repository wrapper for `ScienceReviewAttempt` if review behavior grows.
- Replace `datetime.utcnow()` usage with timezone-aware UTC timestamps.
- Expand Science architecture docs with diagrams once more topics are added.

## Recommended Sprint 10 Goal

Sprint 10 should return focus to the Tree House as EduQuest's central home base.

Suggested Sprint 10 direction:

```txt
Sprint 10 – Tree House Home Base
```

Potential goals:

- Richer Tree House visual scene
- Character integration
- Today's Quest
- Tree of Growth
- Clearer adventure launch controls
- Visible inventory and rewards
- Central progress overview

Do not add new Science topics until the P1 cleanup items are addressed or accepted.
