import { SCIENCE_EXPERIMENTS as RICH_SCIENCE_EXPERIMENTS } from "../scienceExperiments.js";
import { SCIENCE_LESSONS } from "../scienceLessons.js";
import { SCIENCE_TOPICS } from "../scienceTopics.js";
import { validateScienceContent } from "./validateScienceContent.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const REGISTRY_FIXTURE = [
  ["electricity-1", "electricity", "observation", 1, null],
  ["electricity-2", "electricity", "classification", 2, "electricity-1"],
  ["electricity-3", "electricity", "matching", 3, "electricity-2"],
  ["electricity-4", "electricity", "sequencing", 4, "electricity-3"],
  ["electricity-5", "electricity", "prediction", 5, "electricity-4"],
  ["magnets-1", "magnetism", "observation", 1, null],
  ["magnets-2", "magnetism", "classification", 2, "magnets-1"],
  ["magnets-3", "magnetism", "matching", 3, "magnets-2"],
  ["magnets-4", "magnetism", "sequencing", 4, "magnets-3"],
  ["magnets-5", "magnetism", "prediction", 5, "magnets-4"],
].map(([id, topicId, activityType, order, requires]) => ({
  id,
  title: id,
  topic_id: topicId,
  activity_type: activityType,
  xp_reward: 10,
  xp: 10,
  order,
  requires,
}));

function validate(overrides = {}) {
  return validateScienceContent({
    registryExperiments: REGISTRY_FIXTURE,
    richExperiments: RICH_SCIENCE_EXPERIMENTS,
    lessons: SCIENCE_LESSONS,
    topics: SCIENCE_TOPICS,
    ...overrides,
  });
}

export function runValidateScienceContentTests() {
  const errors = validate();

  assert(errors.length === 0, `Current Science content should pass validation: ${errors.join("; ")}`);
  assert(
    REGISTRY_FIXTURE.filter((experiment) => experiment.topic_id === "electricity").length === 5,
    "Electricity registry fixture should contain five missions."
  );
  assert(
    REGISTRY_FIXTURE.filter((experiment) => experiment.topic_id === "magnetism").length === 5,
    "Magnetism registry fixture should contain five missions."
  );

  const missingLessonErrors = validate({
    lessons: SCIENCE_LESSONS.filter((lesson) => lesson.id !== "magnets-3"),
  });
  assert(
    missingLessonErrors.some((error) => error.includes("magnets-3") && error.includes("missing frontend lesson")),
    "Missing lesson definitions should be detected."
  );

  const mismatchedActivityErrors = validate({
    lessons: SCIENCE_LESSONS.map((lesson) =>
      lesson.id === "magnets-3"
        ? {
            ...lesson,
            activities: [{ ...lesson.activities[0], activityType: "prediction" }],
          }
        : lesson
    ),
  });
  assert(
    mismatchedActivityErrors.some(
      (error) => error.includes("magnets-3") && error.includes("frontend activity type")
    ),
    "Mismatched activity types should be detected."
  );

  const malformedActivityErrors = validate({
    lessons: SCIENCE_LESSONS.map((lesson) =>
      lesson.id === "magnets-2"
        ? {
            ...lesson,
            activities: [{ ...lesson.activities[0], items: [] }],
          }
        : lesson
    ),
  });
  assert(
    malformedActivityErrors.some(
      (error) => error.includes("magnets-2") && error.includes("sortable items")
    ),
    "Malformed classification data should be detected."
  );

  const unknownFrontendContentErrors = validate({
    richExperiments: [
      ...RICH_SCIENCE_EXPERIMENTS,
      { id: "frontend-only", title: "Extra", description: "Extra" },
    ],
  });
  assert(
    unknownFrontendContentErrors.some(
      (error) => error.includes("frontend-only") && error.includes("no backend registry entry")
    ),
    "Unknown frontend experiment content should be detected."
  );

  const unknownFrontendLessonErrors = validate({
    lessons: [
      ...SCIENCE_LESSONS,
      {
        ...SCIENCE_LESSONS[0],
        id: "frontend-only-lesson",
      },
    ],
  });
  assert(
    unknownFrontendLessonErrors.some(
      (error) => error.includes("frontend-only-lesson") && error.includes("no backend registry entry")
    ),
    "Unknown frontend lesson content should be detected."
  );
}
