import { API_BASE_URL } from "../config/api.js";

async function parseShortcutError(response, fallbackMessage) {
  try {
    const body = await response.json();
    return body.detail ?? fallbackMessage;
  } catch (error) {
    return fallbackMessage;
  }
}

export async function getTreehouseShortcuts() {
  const response = await fetch(`${API_BASE_URL}/treehouse/shortcuts`);

  if (!response.ok) {
    throw new Error("Unable to load Treehouse shortcuts.");
  }

  return response.json();
}

export async function getTreehouseShortcut(shortcutId) {
  const response = await fetch(`${API_BASE_URL}/treehouse/shortcuts/${shortcutId}`);

  if (!response.ok) {
    throw new Error("Unable to load Treehouse shortcut.");
  }

  return response.json();
}

export async function contributeToTreehouseShortcut(shortcutId) {
  const response = await fetch(`${API_BASE_URL}/treehouse/shortcuts/${shortcutId}/contribute`, {
    method: "POST",
  });

  if (!response.ok) {
    const message = await parseShortcutError(response, "Unable to build this Treehouse shortcut.");
    throw new Error(message);
  }

  return response.json();
}
