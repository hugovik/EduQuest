# Sprint 1 Technical Debt Audit

## Status

Sprint 1 has moved from planning into implementation. The first gameplay loop is now functional, but several core-game systems still need hardening before larger feature work continues.

---

## Completed

- Architecture audit completed.
- Repository audit completed.
- Quest completion connected from UI to backend.
- QuestCompletion persistence added.
- ProgressEvent creation retained.
- TreeGrowthEvent creation retained.
- Progress summary endpoint added.
- Achievement unlock system started.
- React Query invalidation aligned to actual query keys.

---

## High-Priority Debt

### 1. Database migrations

Current backend relies on SQLAlchemy `create_all`. This is acceptable for MVP prototyping, but Sprint 2 should introduce Alembic migrations before the model layer grows further.

### 2. Transaction boundaries

Quest completion, progress events, tree growth events, and achievement unlocks now happen in a single unit of work. This should be formalized as a domain transaction pattern in Sprint 2.

### 3. Duplicate completion policy

The app currently allows repeat completions of the same quest. This may be intentional for daily practice, but the rule needs to be documented and enforced by quest type.

### 4. Testing coverage

Backend tests are still the biggest gap. Priority tests:

- Completing a valid quest creates QuestCompletion.
- Completing a quest creates ProgressEvent.
- Completing a quest creates TreeGrowthEvent.
- Completing first quest unlocks First Quest achievement.
- Invalid quest returns 404.

### 5. Frontend state consistency

React Query invalidation now targets `player`, `quests`, and `progress-summary`. Future gameplay systems should use stable query key constants.

---

## Sprint 2 Recommendation

Start Sprint 2 with tests and migrations before expanding achievements, streaks, certificates, or parent dashboard reporting.
