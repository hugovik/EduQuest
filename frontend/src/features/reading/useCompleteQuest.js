import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeQuest } from "../../api/questCompletionApi";

export function useCompleteQuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeQuest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["player"] });
      queryClient.invalidateQueries({ queryKey: ["quests"] });
      queryClient.invalidateQueries({ queryKey: ["progress-summary"] });
    },
  });
}
