import { useQuery } from "@tanstack/react-query";
import { getPlayer } from "../../../api/playerApi";
import { queryKeys } from "../../../api/queryKeys";

export function usePlayer() {
  return useQuery({
    queryKey: queryKeys.player,
    queryFn: getPlayer,
  });
}
