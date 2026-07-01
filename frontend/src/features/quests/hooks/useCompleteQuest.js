import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeQuest } from "../../../api/questCompletionApi";
import { queryKeys } from "../../../api/queryKeys";

export function useCompleteQuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeQuest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.player });
      queryClient.invalidateQueries({ queryKey: queryKeys.quests });
      queryClient.invalidateQueries({ queryKey: queryKeys.progressSummary });
    },
  });
}
