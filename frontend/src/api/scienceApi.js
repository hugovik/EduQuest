import { API_BASE_URL } from "../config/api.js";

export async function getScienceExperiments() {
  const response = await fetch(`${API_BASE_URL}/science/experiments`);

  if (!response.ok) {
    throw new Error("Unable to load Science Lab missions.");
  }

  return response.json();
}

export async function getScienceProgress() {
  const response = await fetch(`${API_BASE_URL}/science/progress`);

  if (!response.ok) {
    throw new Error("Unable to load Science Lab progress.");
  }

  return response.json();
}

export async function completeScienceExperiment(experimentId) {
  const response = await fetch(`${API_BASE_URL}/science/experiments/${experimentId}/complete`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Unable to complete Science Lab experiment.");
  }

  return response.json();
}
