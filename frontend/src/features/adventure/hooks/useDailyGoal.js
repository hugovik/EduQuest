import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDailyGoal, getDailyStreak } from "../../../api/dailyGoalApi";
import { queryKeys } from "../../../api/queryKeys";

export function useDailyGoal() {
  const queryClient = useQueryClient();
  const goalQuery = useQuery({
    queryKey: queryKeys.dailyGoal,
    queryFn: getDailyGoal,
  });
  const streakQuery = useQuery({
    queryKey: queryKeys.dailyStreak,
    queryFn: getDailyStreak,
  });

  return {
    dailyGoal: goalQuery.data,
    streak: streakQuery.data,
    loading: goalQuery.isLoading || streakQuery.isLoading,
    error: goalQuery.error ?? streakQuery.error,
    refresh: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dailyGoal });
      queryClient.invalidateQueries({ queryKey: queryKeys.dailyStreak });
    },
  };
}
