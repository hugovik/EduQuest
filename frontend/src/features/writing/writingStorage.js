const STORAGE_KEY = "eduquest-writing-progress";

const DEFAULT_PROGRESS = {
  completedLessons: [],
  earnedXp: 0,
};

export function loadWritingProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return DEFAULT_PROGRESS;
    }

    const parsed = JSON.parse(saved);

    return {
      completedLessons: Array.isArray(parsed.completedLessons)
        ? parsed.completedLessons
        : [],
      earnedXp: Number.isFinite(parsed.earnedXp) ? parsed.earnedXp : 0,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveWritingProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function resetWritingProgress() {
  localStorage.removeItem(STORAGE_KEY);
}