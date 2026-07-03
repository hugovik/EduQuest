import { useQuery } from "@tanstack/react-query";
import { getAdventureUnlocks } from "../../../api/adventureUnlocksApi";
import { queryKeys } from "../../../api/queryKeys";

export function useAdventureUnlocks() {
  return useQuery({
    queryKey: queryKeys.adventureUnlocks,
    queryFn: getAdventureUnlocks,
  });
}
