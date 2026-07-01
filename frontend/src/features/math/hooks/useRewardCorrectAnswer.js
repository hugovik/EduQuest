import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rewardCorrectAnswer } from "../../../api/inventoryApi";
import { queryKeys } from "../../../api/queryKeys";

export function useRewardCorrectAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rewardCorrectAnswer,
    onSuccess: (result) => {
      queryClient.setQueryData(queryKeys.inventory, result.inventory);

      if (result.daily_goal) {
        queryClient.setQueryData(queryKeys.dailyGoal, result.daily_goal);
      }

      if (result.streak) {
        queryClient.setQueryData(queryKeys.dailyStreak, result.streak);
      }

      queryClient.setQueryData(queryKeys.obstacleProgress, (existing = []) => {
        const nextProgress = result.obstacle_progress;
        const hasProgress = existing.some(
          (item) => item.obstacle_id === nextProgress.obstacle_id
        );

        if (!hasProgress) {
          return [...existing, nextProgress];
        }

        return existing.map((item) =>
          item.obstacle_id === nextProgress.obstacle_id ? nextProgress : item
        );
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory });
      queryClient.invalidateQueries({ queryKey: queryKeys.obstacleProgress });
      queryClient.invalidateQueries({ queryKey: queryKeys.dailyGoal });
      queryClient.invalidateQueries({ queryKey: queryKeys.dailyStreak });
    },
  });
}
