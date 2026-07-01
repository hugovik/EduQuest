import { API_BASE_URL } from "../config/api";

export async function getProgressSummary() {
  const { data } = await api.get("/quests/progress/summary");
  return data;
}