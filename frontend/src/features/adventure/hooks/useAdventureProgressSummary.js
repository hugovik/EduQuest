import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdventureProgressSummary } from "../../../api/adventureProgressApi";
import { queryKeys } from "../../../api/queryKeys";

export function useAdventureProgressSummary() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: queryKeys.adventureProgressSummary,
    queryFn: getAdventureProgressSummary,
  });

  return {
    progressSummary: query.data,
    loading: query.isLoading,
    error: query.error,
    refresh: () => queryClient.invalidateQueries({
      queryKey: queryKeys.adventureProgressSummary,
    }),
  };
}
