import { queryKeys } from "./queryKeys.js";

export function invalidateGlobalProgress(queryClient) {
  [
    queryKeys.player,
    queryKeys.progressSummary,
    queryKeys.adventureProgressSummary,
    queryKeys.adventureUnlocks,
    queryKeys.worldState,
    queryKeys.worldProgressSummary,
    queryKeys.achievements,
    queryKeys.earnedAchievements,
    queryKeys.dailyGoal,
    queryKeys.dailyStreak,
  ].forEach((queryKey) => {
    queryClient.invalidateQueries({ queryKey });
  });
}
