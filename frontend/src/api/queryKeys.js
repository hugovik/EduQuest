export const queryKeys = {
  player: ["player"],
  quests: ["quests"],
  progressSummary: ["progress-summary"],
  inventory: ["inventory"],
  obstacleProgress: ["obstacle-progress"],
  learningPreferences: ["learning-preferences"],
  learningPreference: (adventureType) => ["learning-preference", adventureType],
};
