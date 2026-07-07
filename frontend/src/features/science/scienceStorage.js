const SCIENCE_PROGRESS_KEY = "eduquest:science-progress";

export function loadScienceProgress() {
  try {
    const saved = localStorage.getItem(SCIENCE_PROGRESS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function saveScienceProgress(progress) {
  localStorage.setItem(SCIENCE_PROGRESS_KEY, JSON.stringify(progress));
}

export function resetScienceProgress() {
  localStorage.removeItem(SCIENCE_PROGRESS_KEY);
}