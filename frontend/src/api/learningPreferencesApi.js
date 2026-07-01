import { API_BASE_URL } from "../config/api.js";

export async function getLearningPreferences() {
  const response = await fetch(`${API_BASE_URL}/learning/preferences`);

  if (!response.ok) {
    throw new Error("Unable to load learning preferences.");
  }

  return response.json();
}

export async function getLearningPreference(adventureType) {
  const response = await fetch(
    `${API_BASE_URL}/learning/preferences/${adventureType}`
  );

  if (!response.ok) {
    throw new Error("Unable to load learning preference.");
  }

  return response.json();
}

export async function updateLearningPreference(adventureType, overrideLevel) {
  const response = await fetch(
    `${API_BASE_URL}/learning/preferences/${adventureType}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        override_level: overrideLevel,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Unable to update learning preference: ${response.status}`);
  }

  return response.json();
}
