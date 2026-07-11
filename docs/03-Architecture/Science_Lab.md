# Science Lab Architecture

Science Lab uses the shared EduQuest adventure systems while keeping rich lesson presentation editable on the frontend.

## Ownership Boundaries

Backend owns authoritative gameplay state:

- Official topic IDs and mission IDs
- Topic membership, order, and prerequisites
- Activity type for each mission
- XP rewards
- Mission completion state
- Topic completion state
- Topic rewards and achievements
- Review eligibility
- Review answer keys, scoring, attempts, best score, and mastery
- Science progress summaries

Frontend owns presentation content:

- Mission titles, descriptions, introductions, and equipment display
- Lesson objectives, vocabulary, fun facts, and Professor Nova copy
- Activity visual content
- Review explanations
- Science Lab layout and visual states

## Backend Flow

Official Science metadata lives in `backend/app/content/science_registry.py`.

Review answer keys live in `backend/app/content/science_review_registry.py`.

Mission completion uses `ScienceService.complete_experiment()`:

1. Load the default child.
2. Validate the mission ID and topic-local prerequisite.
3. If already completed, return zero XP without duplicate events.
4. Award XP through `AdventureCompletionService`.
5. Evaluate mission achievements.
6. Detect topic completion from backend registry membership.
7. Grant topic inventory reward once through `InventoryService`.
8. Evaluate topic achievements.
9. Return updated Science progress.

Review completion uses `ScienceService.complete_topic_review()`:

1. Confirm the topic exists.
2. Confirm the topic is completed.
3. Confirm every submitted experiment belongs to the selected topic.
4. Reject missing, duplicate, cross-topic, unknown, or malformed answers.
5. Validate each answer against backend-owned answer keys.
6. Calculate score, percentage, best score, and mastery.
7. Persist a `ScienceReviewAttempt`.
8. Return child-safe per-question results.

Reviews award zero XP and do not grant rewards or achievements.

## Frontend Flow

`ScienceLabPage.jsx` loads backend registry metadata and backend progress, then merges it with frontend presentation content through `buildScienceExperiments()`.

Topic unlock behavior is topic-local:

- `electricity-1` is open by default.
- `magnets-1` is open by default.
- Later missions require the previous mission in the same topic.

`ScienceAdventure.jsx` runs the standard mission flow:

Science Lab -> Experiment Intro -> Mission Briefing -> Shared Activity -> Backend Completion -> Reward -> Science Lab

`ScienceTopicReview.jsx` runs completed-topic practice reviews and submits actual learner answers. It does not submit authoritative score or correctness.

## Shared Activity Contract

Science activities use the shared lesson engine and return normalized results:

```js
{
  answer,
  locallyCorrect,
  correct,
  score,
  attempts,
  xpRequested
}
```

`answer` is used for backend review scoring. `locallyCorrect` and `correct` are only local feedback signals and are not trusted for persisted review scores.

## Adding A New Science Topic

1. Add backend topic metadata in `science_registry.py`.
2. Add official mission registry entries with stable IDs, topic ID, order, prerequisite, activity type, and XP.
3. Add backend review answer keys in `science_review_registry.py`.
4. Add frontend topic metadata in `scienceTopics.js`.
5. Add frontend experiment presentation content in `scienceExperiments.js`.
6. Add lesson/activity content in `scienceLessons.js`.
7. Add learning metadata: objective, vocabulary, fun fact, duration, difficulty.
8. Add review explanations.
9. Run backend registry validation tests.
10. Run frontend Science content validation tests.
11. Add/extend backend completion, reward, and review tests.
12. Add/extend frontend API and activity contract tests.

## Current Topics

- Electricity: `electricity-1` through `electricity-5`
- Magnetism: `magnets-1` through `magnets-5`

Current topic rewards:

- Electricity -> `lightning_crystal`
- Magnetism -> `magnetic_compass`
