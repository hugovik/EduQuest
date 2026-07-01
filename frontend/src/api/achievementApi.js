import { API_BASE_URL } from "../config/api.js";

export async function getAchievements() {
  const response = await fetch(`${API_BASE_URL}/achievements`);

  if (!response.ok) {
    throw new Error("Unable to load achievements.");
  }

  return response.json();
}

export async function getEarnedAchievements() {
  const response = await fetch(`${API_BASE_URL}/achievements/earned`);

  if (!response.ok) {
    throw new Error("Unable to load earned achievements.");
  }

  return response.json();
}

export async function evaluateAchievementEvent({ eventType, sourceAdventure, metadata }) {
  const response = await fetch(`${API_BASE_URL}/achievements/evaluate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event_type: eventType,
      source_adventure: sourceAdventure,
      metadata,
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to evaluate achievements.");
  }

  return response.json();
}
