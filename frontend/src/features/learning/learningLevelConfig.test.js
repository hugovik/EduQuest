import {
  getAdventureLevelConfig,
  getEffectiveLearningLevel,
} from "./learningLevelConfig.js";
import { generateMathProblem } from "../math/utils/generateMathProblem.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export function runLearningLevelConfigTests() {
  assert(
    getEffectiveLearningLevel({ childGrade: 2, overrideLevel: null }) === 2,
    "Child grade should be the default effective level."
  );

  assert(
    getEffectiveLearningLevel({ childGrade: 2, overrideLevel: 3 }) === 3,
    "Override level should take priority."
  );

  assert(
    getEffectiveLearningLevel({ childGrade: undefined, overrideLevel: null }) === 2,
    "Missing grade should default to Level 2."
  );

  assert(
    getEffectiveLearningLevel({ childGrade: 2, overrideLevel: 99 }) === 5,
    "High override should clamp to Level 5."
  );

  assert(
    getEffectiveLearningLevel({ childGrade: 4, overrideLevel: "not-a-level" }) === 4,
    "Nonnumeric override should be ignored in favor of child grade."
  );

  assert(
    getEffectiveLearningLevel({ childGrade: -4, overrideLevel: null }) === 1,
    "Low child grade should clamp to Level 1."
  );

  const mathLevelOne = getAdventureLevelConfig({
    adventureType: "math",
    childGrade: 1,
  });
  assert(
    mathLevelOne.config.operations.join(",") === "addition,subtraction",
    "Math Level 1 should only allow addition and subtraction."
  );

  for (let index = 0; index < 100; index += 1) {
    const problem = generateMathProblem({
      operation: "mixed",
      levelConfig: mathLevelOne.config,
    });
    assert(
      mathLevelOne.config.operations.includes(problem.operation),
      "Math Surprise Me should respect available operations."
    );
  }

  const readingLevelTwo = getAdventureLevelConfig({
    adventureType: "reading",
    childGrade: 2,
  });
  assert(
    readingLevelTwo.config.passageWords === 100,
    "Reading Level 2 should return expected passage length."
  );

  const scienceLevelThree = getAdventureLevelConfig({
    adventureType: "science",
    childGrade: 3,
  });
  assert(
    scienceLevelThree.config.topics.includes("life_cycles"),
    "Science Level 3 should return expected topics."
  );

  const unknownAdventure = getAdventureLevelConfig({
    adventureType: "unknown",
    childGrade: 2,
  });
  assert(
    unknownAdventure.config === null && unknownAdventure.effectiveLevel === 2,
    "Unknown adventure should fail safely."
  );
}
