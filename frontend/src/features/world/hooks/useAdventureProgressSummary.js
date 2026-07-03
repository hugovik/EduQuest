import { useQuery } from "@tanstack/react-query";
import { getAdventureProgressSummary } from "../../../api/adventureProgressApi";
import { queryKeys } from "../../../api/queryKeys";

export function useAdventureProgressSummary() {
  return useQuery({
    queryKey: queryKeys.adventureProgressSummary,
    queryFn: getAdventureProgressSummary,
  });
}
