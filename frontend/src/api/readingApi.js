import { API_BASE_URL } from "../config/api.js";

export async function getReadingPassages(level = 2) {
  const response = await fetch(`${API_BASE_URL}/reading/passages?level=${level}`);

  if (!response.ok) {
    throw new Error("Unable to load reading passages.");
  }

  return response.json();
}

export async function getReadingProgress() {
  const response = await fetch(`${API_BASE_URL}/reading/progress`);

  if (!response.ok) {
    throw new Error("Unable to load reading progress.");
  }

  return response.json();
}

export async function getReadingProgressSummary(level = 2) {
  const response = await fetch(`${API_BASE_URL}/reading/progress/summary?level=${level}`);

  if (!response.ok) {
    throw new Error("Unable to load reading progress summary.");
  }

  return response.json();
}

export async function submitReadingAnswers({ passageId, answers }) {
  const response = await fetch(`${API_BASE_URL}/reading/passages/${passageId}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ answers }),
  });

  if (!response.ok) {
    throw new Error(`Reading answers could not be saved: ${response.status}`);
  }

  return response.json();
}
