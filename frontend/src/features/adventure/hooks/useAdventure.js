import { useQuery } from "@tanstack/react-query";
import { getAdventure, getAdventures } from "../../../api/adventuresApi";
import { queryKeys } from "../../../api/queryKeys";

export function useAdventures() {
  return useQuery({
    queryKey: queryKeys.adventures,
    queryFn: getAdventures,
  });
}

export function useAdventure(adventureId) {
  return useQuery({
    queryKey: queryKeys.adventure(adventureId),
    queryFn: () => getAdventure(adventureId),
    enabled: Boolean(adventureId),
  });
}
