import { API_BASE_URL } from "../config/api.js";

export async function getAdventures() {
  const response = await fetch(`${API_BASE_URL}/adventures`);

  if (!response.ok) {
    throw new Error("Unable to load adventures.");
  }

  return response.json();
}

export async function getAdventure(adventureId) {
  const response = await fetch(`${API_BASE_URL}/adventures/${adventureId}`);

  if (!response.ok) {
    throw new Error("Unable to load adventure.");
  }

  return response.json();
}

export async function getAdventureProgress(adventureId) {
  const response = await fetch(`${API_BASE_URL}/adventures/${adventureId}/progress`);

  if (!response.ok) {
    throw new Error("Unable to load adventure progress.");
  }

  return response.json();
}
