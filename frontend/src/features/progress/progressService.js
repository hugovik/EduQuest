const ADVENTURE_PROGRESS_KEYS = {
  writing: "eduquest:writing-progress",
  science: "eduquest:science-progress",
};

export function loadAdventureProgress(adventureKey) {
  const storageKey = ADVENTURE_PROGRESS_KEYS[adventureKey];

  if (!storageKey) {
    return {};
  }

  try {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function saveAdventureProgress(adventureKey, progress) {
  const storageKey = ADVENTURE_PROGRESS_KEYS[adventureKey];

  if (!storageKey) {
    return;
  }

  localStorage.setItem(storageKey, JSON.stringify(progress));
}

export function getCompletedLessons(progress) {
  if (Array.isArray(progress.completedLessons)) {
    return progress.completedLessons;
  }

  // Backward compatibility with old science progress:
  // { "electricity-1": { completed: true } }
  return Object.entries(progress)
    .filter(([, value]) => value?.completed === true)
    .map(([lessonId]) => lessonId);
}

export function completeAdventureLesson({
  adventureKey,
  lessonId,
}) {
  const progress = loadAdventureProgress(adventureKey);
  const completedLessons = getCompletedLessons(progress);

  if (completedLessons.includes(lessonId)) {
    return {
      ...progress,
      completedLessons,
    };
  }

  const nextProgress = {
    ...progress,
    completedLessons: [...completedLessons, lessonId],
  };

  saveAdventureProgress(adventureKey, nextProgress);

  return nextProgress;
}

export function getAdventureStats({
  adventureKey,
  lessons,
}) {
  const progress = loadAdventureProgress(adventureKey);
  const completedLessons = getCompletedLessons(progress);

  const xp = completedLessons.reduce((total, lessonId) => {
    const lesson = lessons.find((item) => item.id === lessonId);
    return total + (lesson?.xp ?? 0);
  }, 0);

  return {
    progress,
    completedLessons,
    completedCount: completedLessons.length,
    totalLessons: lessons.length,
    xp,
  };
}