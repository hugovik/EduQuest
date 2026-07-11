import { runAchievementApiTests } from "./features/adventure/achievementApi.test.js";
import { runAdventureApiTests } from "./features/world/adventureApi.test.js";
import { runAdventureConfigTests } from "./features/adventure/adventureConfig.test.js";
import { runAdventuresApiTests } from "./features/adventure/adventuresApi.test.js";
import { runAdventureProgressApiTests } from "./features/adventure/adventureProgressApi.test.js";
import { runAdventureUnlocksApiTests } from "./features/adventure/adventureUnlocksApi.test.js";
import { runDailyGoalApiTests } from "./features/adventure/dailyGoalApi.test.js";
import { runActivityContractTests } from "./features/lesson/activityContract.test.js";
import { runGenerateMathProblemTests } from "./features/math/utils/generateMathProblem.test.js";
import { runInventoryApiTests } from "./features/world/inventoryApi.test.js";
import { runLearningLevelConfigTests } from "./features/learning/learningLevelConfig.test.js";
import { runLearningPreferencesApiTests } from "./features/learning/learningPreferencesApi.test.js";
import { runReadingApiTests } from "./features/reading/readingApi.test.js";
import { runScienceApiTests } from "./features/science/scienceApi.test.js";
import { runScienceLessonsTests } from "./features/science/scienceLessons.test.js";
import { runBuildScienceExperimentsTests } from "./features/science/utils/buildScienceExperiments.test.js";
import { runValidateScienceContentTests } from "./features/science/utils/validateScienceContent.test.js";
import { runTreehouseHomeTests } from "./features/treehouse/treehouseHome.test.js";
import { runWorldApiTests } from "./features/world/worldApi.test.js";
import { runWorldRegionConfigTests } from "./features/world/worldRegionConfig.test.js";
import { runWritingApiTests } from "./features/writing/writingApi.test.js";

const tests = [
  ["achievement API", runAchievementApiTests],
  ["adventure API", runAdventureApiTests],
  ["adventure config", runAdventureConfigTests],
  ["adventures API", runAdventuresApiTests],
  ["adventure progress API", runAdventureProgressApiTests],
  ["adventure unlocks API", runAdventureUnlocksApiTests],
  ["daily goal API", runDailyGoalApiTests],
  ["activity contract", runActivityContractTests],
  ["math problem generation", runGenerateMathProblemTests],
  ["inventory API", runInventoryApiTests],
  ["learning level config", runLearningLevelConfigTests],
  ["learning preferences API", runLearningPreferencesApiTests],
  ["reading API", runReadingApiTests],
  ["science API", runScienceApiTests],
  ["science lessons", runScienceLessonsTests],
  ["science experiment builder", runBuildScienceExperimentsTests],
  ["science content validation", runValidateScienceContentTests],
  ["treehouse home", runTreehouseHomeTests],
  ["world API", runWorldApiTests],
  ["world region config", runWorldRegionConfigTests],
  ["writing API", runWritingApiTests],
];

let failures = 0;

for (const [name, runTest] of tests) {
  try {
    await runTest();
    console.log(`PASS ${name}`);
  } catch (error) {
    failures += 1;
    console.error(`FAIL ${name}`);
    console.error(error);
  }
}

if (failures > 0) {
  console.error(`${failures} frontend test suite${failures === 1 ? "" : "s"} failed.`);
  process.exit(1);
}

console.log(`${tests.length} frontend test suites passed.`);
