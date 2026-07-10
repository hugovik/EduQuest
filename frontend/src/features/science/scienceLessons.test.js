import { SCIENCE_EXPERIMENTS } from "./scienceExperiments.js";
import { SCIENCE_LESSONS } from "./scienceLessons.js";
import { readFileSync } from "node:fs";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export function runScienceLessonsTests() {
  const scienceLabPageSource = readFileSync(
    new URL("./ScienceLabPage.jsx", import.meta.url),
    "utf8"
  );
  const magnetExperiments = SCIENCE_EXPERIMENTS.filter(
    (experiment) => experiment.group === "Magnetism"
  );
  const magnetLessons = SCIENCE_LESSONS.filter((lesson) =>
    lesson.id.startsWith("magnets-")
  );
  const magnetActivityTypes = magnetLessons.map(
    (lesson) => lesson.activities[0].activityType
  );
  const electricityFiveIndex = SCIENCE_EXPERIMENTS.findIndex(
    (experiment) => experiment.id === "electricity-5"
  );
  const magnetOneIndex = SCIENCE_EXPERIMENTS.findIndex(
    (experiment) => experiment.id === "magnets-1"
  );

  assert(magnetExperiments.length === 5, "Magnetism should have five experiments.");
  assert(magnetLessons.length === 5, "Magnetism should have five lessons.");
  assert(
    magnetOneIndex === electricityFiveIndex + 1,
    "Magnetism frontend content should remain grouped after Electricity content."
  );
  assert(
    magnetActivityTypes.join(",") ===
      "observation,classification,matching,sequencing,prediction",
    "Magnetism should reuse the shared activity components in order."
  );
  assert(
    magnetLessons.every((lesson) => lesson.xp > 0 && lesson.successMessage),
    "Every Magnetism lesson should define an XP reward and completion message."
  );
  assert(
    SCIENCE_LESSONS.every((lesson) => lesson.reviewExplanation),
    "Every Science lesson should include a short review explanation."
  );
  assert(
    scienceLabPageSource.includes("aria-expanded") &&
      scienceLabPageSource.includes("aria-controls"),
    "Science topic accordion should expose accessible expanded state."
  );
}
