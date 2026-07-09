import { API_BASE_URL } from "../config/api.js";

export async function getWritingProgress() {
  const response = await fetch(`${API_BASE_URL}/writing/progress`);

  if (!response.ok) {
    throw new Error("Unable to load Writing Kingdom progress.");
  }

  return response.json();
}

export async function completeWritingLesson(lessonId) {
  const response = await fetch(`${API_BASE_URL}/writing/lessons/${lessonId}/complete`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Unable to complete Writing Kingdom lesson.");
  }

  return response.json();
}
