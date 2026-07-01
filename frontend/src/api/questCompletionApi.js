import { API_BASE_URL } from "../config/api";

export async function completeQuest(questId) {
  const response = await fetch(`${API_BASE_URL}/quests/${questId}/complete`, {
    method: "POST",
  });

  if (!response.ok) {
    const error = new Error(
      response.status === 409
        ? "This adventure is already complete."
        : `Quest completion failed: ${response.status}`
    );
    error.status = response.status;
    throw error;
  }

  return response.json();
}
