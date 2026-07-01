import {
  DEFAULT_LEARNING_LEVEL,
  LEARNING_LEVEL_CONFIG,
  clampLearningLevel,
  getAdventureLevelConfig,
} from "../../learning/learningLevelConfig.js";

export const DEFAULT_MATH_GRADE = DEFAULT_LEARNING_LEVEL;

export const MATH_OPERATIONS = [
  "addition",
  "subtraction",
  "multiplication",
  "division",
];

export const MATH_GRADE_CONFIG = LEARNING_LEVEL_CONFIG.math;

export function normalizeMathGrade(grade) {
  return clampLearningLevel(grade);
}

export function getMathGradeConfig(grade) {
  return getAdventureLevelConfig({
    adventureType: "math",
    childGrade: grade,
  }).config;
}

export function getAvailableMathOperations(levelOrConfig) {
  const config = typeof levelOrConfig === "object"
    ? levelOrConfig
    : getMathGradeConfig(levelOrConfig);

  return config?.operations ?? [];
}

export function isMathOperationAvailable(operation, levelOrConfig) {
  if (operation === "mixed") {
    return true;
  }

  return getAvailableMathOperations(levelOrConfig).includes(operation);
}

export function getMathOperationUnlockGrade(operation) {
  const levels = Object.keys(MATH_GRADE_CONFIG)
    .map(Number)
    .sort((left, right) => left - right);

  return levels.find((level) => MATH_GRADE_CONFIG[level]?.operations.includes(operation));
}
