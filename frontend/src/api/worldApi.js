import { API_BASE_URL } from "../config/api.js";

export async function getWorldState() {
  const response = await fetch(`${API_BASE_URL}/world/state`);

  if (!response.ok) {
    throw new Error("Unable to load world state.");
  }

  return response.json();
}

export async function getWorldProgressSummary() {
  const response = await fetch(`${API_BASE_URL}/world/progress/summary`);

  if (!response.ok) {
    throw new Error("Unable to load world progress summary.");
  }

  return response.json();
}

export async function travelToWorldLocation(location) {
  const response = await fetch(`${API_BASE_URL}/world/travel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ location }),
  });

  if (!response.ok) {
    let message = "Unable to save world travel.";

    try {
      const errorBody = await response.json();
      message = errorBody.detail ?? message;
    } catch (error) {
      // Keep the friendly fallback when the API does not return JSON.
    }

    throw new Error(message);
  }

  return response.json();
}
