export const MIN_LEARNING_LEVEL = 1;
export const MAX_LEARNING_LEVEL = 5;
export const DEFAULT_LEARNING_LEVEL = 2;

export const LEARNING_LEVEL_CONFIG = {
  math: {
    1: {
      label: "Level 1",
      operations: ["addition", "subtraction"],
      maxNumber: 20,
      addition: { min: 0, max: 20, regrouping: false },
      subtraction: { min: 0, max: 20, nonNegative: true },
      multiplication: null,
      division: null,
    },
    2: {
      label: "Level 2",
      operations: ["addition", "subtraction", "multiplication", "division"],
      maxNumber: 100,
      addition: { min: 0, max: 100 },
      subtraction: { min: 0, max: 100, nonNegative: true },
      multiplication: { min: 0, max: 5 },
      division: { divisors: [1, 2, 5, 10], wholeNumberOnly: true },
    },
    3: {
      label: "Level 3",
      operations: ["addition", "subtraction", "multiplication", "division"],
      maxNumber: 1000,
      addition: { min: 0, max: 1000 },
      subtraction: { min: 0, max: 1000, nonNegative: true },
      multiplication: { min: 0, max: 10 },
      division: { divisors: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], wholeNumberOnly: true },
    },
    4: {
      label: "Level 4",
      operations: ["addition", "subtraction", "multiplication", "division"],
      maxNumber: 10000,
      addition: { min: 0, max: 10000 },
      subtraction: { min: 0, max: 10000, nonNegative: true },
      multiplication: { min: 0, max: 12 },
      division: { divisors: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], wholeNumberOnly: true },
    },
    5: {
      label: "Level 5",
      operations: ["addition", "subtraction", "multiplication", "division"],
      maxNumber: 100000,
      addition: { min: 0, max: 100000 },
      subtraction: { min: 0, max: 100000, nonNegative: true },
      multiplication: { min: 0, max: 12, multiDigit: true },
      division: { divisors: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], wholeNumberOnly: true },
    },
  },
  reading: {
    1: { label: "Level 1", sentenceLength: "short", vocabulary: "simple", passageWords: 50 },
    2: { label: "Level 2", sentenceLength: "medium", vocabulary: "grade2", passageWords: 100 },
    3: { label: "Level 3", sentenceLength: "longer", vocabulary: "grade3", passageWords: 150 },
    4: { label: "Level 4", sentenceLength: "varied", vocabulary: "grade4", passageWords: 220 },
    5: { label: "Level 5", sentenceLength: "complex", vocabulary: "grade5", passageWords: 300 },
  },
  writing: {
    1: { label: "Level 1", promptType: "sentence", expectedSentences: 1 },
    2: { label: "Level 2", promptType: "short_story", expectedSentences: 3 },
    3: { label: "Level 3", promptType: "paragraph", expectedSentences: 5 },
    4: { label: "Level 4", promptType: "multi_paragraph", expectedSentences: 8 },
    5: { label: "Level 5", promptType: "structured_story", expectedSentences: 12 },
  },
  geography: {
    1: { label: "Level 1", scope: "home_and_school" },
    2: { label: "Level 2", scope: "community_and_canada" },
    3: { label: "Level 3", scope: "world_basics" },
    4: { label: "Level 4", scope: "regions_and_maps" },
    5: { label: "Level 5", scope: "global_systems" },
  },
  science: {
    1: { label: "Level 1", topics: ["plants", "animals", "weather"] },
    2: { label: "Level 2", topics: ["materials", "buoyancy", "temperature"] },
    3: { label: "Level 3", topics: ["life_cycles", "forces", "rocks"] },
    4: { label: "Level 4", topics: ["habitats", "light", "sound"] },
    5: { label: "Level 5", topics: ["human_body", "electricity", "space"] },
  },
  music: {
    1: { label: "Level 1", topics: ["rhythm", "loud_soft", "fast_slow"] },
    2: { label: "Level 2", topics: ["beat", "pitch", "patterns"] },
    3: { label: "Level 3", topics: ["notes", "tempo", "simple_composition"] },
    4: { label: "Level 4", topics: ["melody", "dynamics", "instruments"] },
    5: { label: "Level 5", topics: ["harmony", "form", "composition"] },
  },
};

export function toIntegerLevel(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return null;
  }

  return Math.trunc(numericValue);
}

export function clampLearningLevel(level) {
  const numericLevel = toIntegerLevel(level);

  if (numericLevel === null) {
    return DEFAULT_LEARNING_LEVEL;
  }

  return Math.min(MAX_LEARNING_LEVEL, Math.max(MIN_LEARNING_LEVEL, numericLevel));
}

export function getEffectiveLearningLevel({ childGrade, overrideLevel } = {}) {
  if (overrideLevel !== null && overrideLevel !== undefined && overrideLevel !== "") {
    const numericOverride = toIntegerLevel(overrideLevel);

    if (numericOverride !== null) {
      return clampLearningLevel(numericOverride);
    }
  }

  if (childGrade !== null && childGrade !== undefined && childGrade !== "") {
    const numericGrade = toIntegerLevel(childGrade);

    if (numericGrade !== null) {
      return clampLearningLevel(numericGrade);
    }
  }

  return DEFAULT_LEARNING_LEVEL;
}

export function getLearningLevelSource({ childGrade, overrideLevel } = {}) {
  if (overrideLevel !== null && overrideLevel !== undefined && overrideLevel !== "") {
    const numericOverride = toIntegerLevel(overrideLevel);

    if (numericOverride !== null) {
      return "override";
    }
  }

  if (childGrade !== null && childGrade !== undefined && childGrade !== "") {
    const numericGrade = toIntegerLevel(childGrade);

    if (numericGrade !== null) {
      return "grade";
    }
  }

  return "default";
}

export function getAdventureLevelConfig({
  adventureType,
  childGrade,
  overrideLevel,
} = {}) {
  const effectiveLevel = getEffectiveLearningLevel({ childGrade, overrideLevel });
  const source = getLearningLevelSource({ childGrade, overrideLevel });
  const adventureConfig = LEARNING_LEVEL_CONFIG[adventureType];

  return {
    effectiveLevel,
    source,
    config: adventureConfig?.[effectiveLevel] ?? null,
  };
}
