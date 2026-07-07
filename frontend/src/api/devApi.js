import { API_BASE_URL } from "../config/api.js";

export async function resetBackendProgress() {
  const response = await fetch(`${API_BASE_URL}/dev/reset-progress`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Unable to reset backend progress.");
  }

  return response.json();
}