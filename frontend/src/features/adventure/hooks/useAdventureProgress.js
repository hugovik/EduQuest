import { useQuery } from "@tanstack/react-query";
import { getAdventureProgress } from "../../../api/adventuresApi";
import { queryKeys } from "../../../api/queryKeys";

export function useAdventureProgress(adventureId) {
  return useQuery({
    queryKey: queryKeys.adventureProgress(adventureId),
    queryFn: () => getAdventureProgress(adventureId),
    enabled: Boolean(adventureId),
  });
}
