import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rewardCorrectAnswer } from "../../../api/inventoryApi";
import { queryKeys } from "../../../api/queryKeys";

export function useRewardCorrectAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rewardCorrectAnswer,
    onSuccess: (result) => {
      queryClient.setQueryData(queryKeys.inventory, result.inventory);
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
    },
  });
}
