import { useQuery } from "@tanstack/react-query";
import { getPlayer } from "../../../api/playerApi";

export function usePlayer() {
    return useQuery({
        queryKey: ["player"],
        queryFn: getPlayer,
    });
}