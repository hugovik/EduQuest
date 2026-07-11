import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  contributeToTreehouseShortcut,
  getTreehouseShortcuts,
} from "../../../api/treehouseShortcutsApi";
import { queryKeys } from "../../../api/queryKeys";

export function useTreehouseShortcuts() {
  const queryClient = useQueryClient();
  const shortcutsQuery = useQuery({
    queryKey: queryKeys.treehouseShortcuts,
    queryFn: getTreehouseShortcuts,
  });

  const contribution = useMutation({
    mutationFn: contributeToTreehouseShortcut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.treehouseShortcuts });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory });
      queryClient.invalidateQueries({ queryKey: queryKeys.worldState });
      queryClient.invalidateQueries({ queryKey: queryKeys.worldProgressSummary });
    },
  });

  return {
    shortcuts: shortcutsQuery.data?.shortcuts ?? [],
    loading: shortcutsQuery.isLoading,
    error: shortcutsQuery.error,
    refresh: shortcutsQuery.refetch,
    contribute: contribution.mutateAsync,
    contributionError: contribution.error,
    isContributing: contribution.isPending,
  };
}
