import { API_BASE_URL } from "../config/api.js";

export async function getAdventureUnlocks() {
  const response = await fetch(`${API_BASE_URL}/adventures/unlocks`);

  if (!response.ok) {
    throw new Error("Unable to load adventure unlocks.");
  }

  return response.json();
}
