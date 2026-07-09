import { readFileSync } from "node:fs";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readSource(path) {
  return readFileSync(new URL(path, import.meta.url), "utf8");
}

export function runActivityContractTests() {
  const renderer = readSource("./components/ActivityRenderer.jsx");
  const observation = readSource("./components/ObservationActivity.jsx");
  const classification = readSource("./components/ClassificationActivity.jsx");
  const matching = readSource("./components/MatchingActivity.jsx");
  const prediction = readSource("./components/PredictionActivity.jsx");
  const sequencing = readSource("./components/SequencingActivity.jsx");
  const rewardScene = readSource("./components/LessonRewardScene.jsx");
  const scienceAdventure = readSource("../science/components/ScienceAdventure.jsx");

  assert(
    renderer.includes("<ObservationActivity") && renderer.includes("lesson={lesson}"),
    "ObservationActivity should receive the normalized lesson prop."
  );
  assert(
    renderer.includes("<ClassificationActivity") && renderer.includes("lesson={lesson}"),
    "ClassificationActivity should receive the normalized lesson prop."
  );
  assert(
    observation.includes("lesson,") && !observation.includes("activity,"),
    "ObservationActivity should accept lesson instead of activity."
  );
  assert(
    classification.includes("lesson,") && !classification.includes("activity,"),
    "ClassificationActivity should accept lesson instead of activity."
  );
  assert(
    observation.includes("xpRequested") && classification.includes("xpRequested"),
    "Normalized activity completions should include xpRequested."
  );
  assert(
    !matching.includes("alert(") &&
      !prediction.includes("alert(") &&
      !sequencing.includes("alert("),
    "Shared science activities should report retry feedback through onComplete instead of browser alerts."
  );
  assert(
    scienceAdventure.includes("dialogue.retry") &&
      scienceAdventure.includes("dialogue.unlock"),
    "ScienceAdventure should render experiment retry and unlock dialogue."
  );
  assert(
    rewardScene.includes("unlockMessage"),
    "LessonRewardScene should be able to show unlock feedback."
  );
}
