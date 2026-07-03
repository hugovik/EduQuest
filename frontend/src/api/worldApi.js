import { API_BASE_URL } from "../config/api.js";

export async function getWorldState() {
  const response = await fetch(`${API_BASE_URL}/world/state`);

  if (!response.ok) {
    throw new Error("Unable to load world state.");
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
    throw new Error("Unable to save world travel.");
  }

  return response.json();
}
