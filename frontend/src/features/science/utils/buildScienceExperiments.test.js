import {
  buildScienceExperiments,
  groupScienceExperimentsByTopic,
  isScienceExperimentUnlocked,
} from "./buildScienceExperiments.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export function runBuildScienceExperimentsTests() {
  const topics = [
    { id: "electricity", title: "Electricity", order: 1 },
    { id: "magnetism", title: "Magnetism", order: 2 },
  ];
  const registryExperiments = [
    {
      id: "electricity-1",
      title: "Backend Electricity",
      topic_id: "electricity",
      activity_type: "observation",
      xp_reward: 10,
      order: 1,
      requires: null,
    },
    {
      id: "electricity-2",
      title: "Backend Electricity 2",
      topic_id: "electricity",
      activity_type: "classification",
      xp_reward: 10,
      order: 2,
      requires: "electricity-1",
    },
    {
      id: "magnets-1",
      title: "Backend Magnetism",
      topic_id: "magnetism",
      activity_type: "observation",
      xp_reward: 10,
      order: 1,
      requires: null,
    },
    {
      id: "magnets-2",
      title: "Backend Magnetism 2",
      topic_id: "magnetism",
      activity_type: "classification",
      xp_reward: 10,
      order: 2,
      requires: "magnets-1",
    },
    {
      id: "backend-only",
      title: "Backend Only",
      topic_id: "magnetism",
      activity_type: "prediction",
      xp_reward: 10,
      order: 3,
      requires: "magnets-2",
    },
  ];
  const richExperiments = [
    {
      id: "electricity-1",
      title: "Frontend Electricity",
      description: "Rich frontend copy.",
      equipment: [{ icon: "⚡", name: "Battery" }],
    },
    {
      id: "frontend-only",
      title: "Not Official",
    },
  ];
  const lessons = [
    {
      id: "electricity-1",
      xp: 50,
      activities: [{ activityType: "matching" }],
    },
  ];

  const experiments = buildScienceExperiments({
    registryExperiments,
    richExperiments,
    lessons,
    topics,
    completedExperimentIds: ["electricity-1"],
  });

  const experimentIds = experiments.map((experiment) => experiment.id);
  const electricityOne = experiments.find((experiment) => experiment.id === "electricity-1");
  const electricityTwo = experiments.find((experiment) => experiment.id === "electricity-2");
  const magnetsOne = experiments.find((experiment) => experiment.id === "magnets-1");
  const magnetsTwo = experiments.find((experiment) => experiment.id === "magnets-2");
  const backendOnly = experiments.find((experiment) => experiment.id === "backend-only");
  const grouped = groupScienceExperimentsByTopic(experiments);

  assert(
    experimentIds.includes("frontend-only") === false,
    "Frontend-only Science content should not become an official mission."
  );
  assert(
    electricityOne.title === "Frontend Electricity",
    "Rich frontend copy should be preserved when official registry metadata exists."
  );
  assert(
    electricityOne.xpReward === 10 && electricityOne.xp === 10,
    "Backend XP should override duplicated frontend XP."
  );
  assert(
    electricityOne.activityType === "observation",
    "Backend activity type should be official."
  );
  assert(
    backendOnly.title === "Backend Only" &&
      backendOnly.hasRichContent === false &&
      backendOnly.hasLesson === false,
    "Backend-only registry entries should get safe fallback content flags."
  );
  assert(
    isScienceExperimentUnlocked(electricityOne, []) === true,
    "First Electricity mission should be unlocked by default."
  );
  assert(
    isScienceExperimentUnlocked(magnetsOne, []) === true,
    "First Magnetism mission should be unlocked by default."
  );
  assert(
    isScienceExperimentUnlocked(magnetsOne, []) === true &&
      isScienceExperimentUnlocked(electricityTwo, ["electricity-1"]) === true,
    "Magnetism should not require Electricity completion."
  );
  assert(
    isScienceExperimentUnlocked(magnetsTwo, []) === false &&
      isScienceExperimentUnlocked(magnetsTwo, ["magnets-1"]) === true,
    "Later missions should require the topic-local previous mission."
  );
  assert(
    grouped.electricity.length === 2 && grouped.magnetism.length === 3,
    "Science missions should group by backend topic ID."
  );
}
