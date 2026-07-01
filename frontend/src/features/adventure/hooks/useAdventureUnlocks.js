import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdventureUnlocks } from "../../../api/adventureUnlocksApi";
import { queryKeys } from "../../../api/queryKeys";

export function useAdventureUnlocks() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: queryKeys.adventureUnlocks,
    queryFn: getAdventureUnlocks,
  });

  return {
    unlocks: query.data,
    loading: query.isLoading,
    error: query.error,
    refresh: () => queryClient.invalidateQueries({
      queryKey: queryKeys.adventureUnlocks,
    }),
  };
}
