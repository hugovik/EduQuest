import { API_BASE_URL } from "../config/api";

export async function getQuests() {
  const response = await fetch(`${API_BASE_URL}/quests`);

  if (!response.ok) {
    throw new Error("Unable to load quests.");
  }

  return response.json();
}