import { apiGet } from "./client";

export function getQuests() {
  return apiGet("/quests");
}