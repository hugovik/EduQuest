import { API_BASE_URL } from "../config/api";

export async function getObstacleProgress() {
  const response = await fetch(`${API_BASE_URL}/inventory/obstacles`);

  if (!response.ok) {
    throw new Error("Unable to load obstacle progress.");
  }

  return response.json();
}
