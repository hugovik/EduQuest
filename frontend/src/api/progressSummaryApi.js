import { API_BASE_URL } from "../config/api";

export async function getProgressSummary() {
  const response = await fetch(`${API_BASE_URL}/quests/progress/summary`);

  if (!response.ok) {
    throw new Error("Unable to load progress summary.");
  }

  return response.json();
}
