import { useQuery } from "@tanstack/react-query";
import { getProgressSummary } from "../../../api/progressSummaryApi";

export function useProgressSummary() {
  return useQuery({
    queryKey: ["progress-summary"],
    queryFn: getProgressSummary,
  });
}
