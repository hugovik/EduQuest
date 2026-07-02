import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  evaluateAchievementEvent,
  getAchievements,
  getEarnedAchievements,
} from "../../../api/achievementApi";
import { queryKeys } from "../../../api/queryKeys";

export function useAchievements() {
  const queryClient = useQueryClient();
  const allQuery = useQuery({
    queryKey: queryKeys.achievements,
    queryFn: getAchievements,
  });
  const earnedQuery = useQuery({
    queryKey: queryKeys.earnedAchievements,
    queryFn: getEarnedAchievements,
  });
  const evaluateMutation = useMutation({
    mutationFn: evaluateAchievementEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.achievements });
      queryClient.invalidateQueries({ queryKey: queryKeys.earnedAchievements });
      queryClient.invalidateQueries({ queryKey: queryKeys.progressSummary });
      queryClient.invalidateQueries({ queryKey: queryKeys.adventureUnlocks });
    },
  });

  return {
    allAchievements: allQuery.data ?? [],
    earnedAchievements: earnedQuery.data ?? [],
    newlyEarnedAchievements: evaluateMutation.data?.newly_earned ?? [],
    loading: allQuery.isLoading || earnedQuery.isLoading,
    error: allQuery.error ?? earnedQuery.error,
    evaluateEvent: evaluateMutation.mutateAsync,
    refresh: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.achievements });
      queryClient.invalidateQueries({ queryKey: queryKeys.earnedAchievements });
    },
  };
}
