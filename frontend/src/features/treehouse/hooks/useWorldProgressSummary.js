import { useQuery } from "@tanstack/react-query";
import { getWorldProgressSummary } from "../../../api/worldApi";
import { queryKeys } from "../../../api/queryKeys";

export function useWorldProgressSummary() {
  return useQuery({
    queryKey: queryKeys.worldProgressSummary,
    queryFn: getWorldProgressSummary,
  });
}
