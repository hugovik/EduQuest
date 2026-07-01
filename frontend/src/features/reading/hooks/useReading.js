import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getReadingPassages,
  getReadingProgress,
  getReadingProgressSummary,
  submitReadingAnswers,
} from "../../../api/readingApi";
import { queryKeys } from "../../../api/queryKeys";

export function useReadingPassages(level) {
  return useQuery({
    queryKey: queryKeys.readingPassages(level),
    queryFn: () => getReadingPassages(level),
  });
}

export function useReadingProgress() {
  return useQuery({
    queryKey: queryKeys.readingProgress,
    queryFn: getReadingProgress,
  });
}

export function useReadingProgressSummary() {
  return useQuery({
    queryKey: queryKeys.readingProgressSummary,
    queryFn: getReadingProgressSummary,
  });
}

export function useSubmitReadingAnswers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitReadingAnswers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.readingProgress });
      queryClient.invalidateQueries({ queryKey: queryKeys.readingProgressSummary });
      queryClient.invalidateQueries({ queryKey: queryKeys.player });
      queryClient.invalidateQueries({ queryKey: queryKeys.dailyGoal });
      queryClient.invalidateQueries({ queryKey: queryKeys.dailyStreak });
      queryClient.invalidateQueries({ queryKey: queryKeys.adventureProgressSummary });
      queryClient.invalidateQueries({ queryKey: queryKeys.adventureUnlocks });
      queryClient.invalidateQueries({ queryKey: queryKeys.achievements });
      queryClient.invalidateQueries({ queryKey: queryKeys.earnedAchievements });
    },
  });
}
