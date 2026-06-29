import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeQuest } from "../../api/questCompletionApi";

export function useCompleteQuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeQuest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["child"] });
      queryClient.invalidateQueries({ queryKey: ["quests"] });
    },
  });
}