import { API_BASE_URL } from "../config/api";

export async function completeQuest(questId) {
  const response = await fetch(`${API_BASE_URL}/quests/${questId}/complete`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Quest completion failed: ${response.status}`);
  }

  return response.json();
}