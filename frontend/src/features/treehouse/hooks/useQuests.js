import { useQuery } from "@tanstack/react-query";
import { getQuests } from "../../../api/questApi";
import { queryKeys } from "../../../api/queryKeys";

export function useQuests() {
  return useQuery({
    queryKey: queryKeys.quests,
    queryFn: getQuests,
  });
}
