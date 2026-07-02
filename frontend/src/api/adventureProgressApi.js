import { API_BASE_URL } from "../config/api.js";

export async function getAdventureProgressSummary() {
  const response = await fetch(`${API_BASE_URL}/adventures/progress/summary`);

  if (!response.ok) {
    throw new Error("Unable to load adventure progress summary.");
  }

  return response.json();
}
