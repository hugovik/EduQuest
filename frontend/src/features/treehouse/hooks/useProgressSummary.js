import { useQuery } from "@tanstack/react-query";
import { getProgressSummary } from "../../../api/progressSummaryApi";
import { queryKeys } from "../../../api/queryKeys";

export function useProgressSummary() {
  return useQuery({
    queryKey: queryKeys.progressSummary,
    queryFn: getProgressSummary,
  });
}
