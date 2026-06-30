import { useQuery } from "@tanstack/react-query";
import { getQuests } from "../../../api/questApi";

export function useQuests() {
  return useQuery({
    queryKey: ["quests"],
    queryFn: getQuests,
  });
}