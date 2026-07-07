export const adventureUnlockRules = {
  math: { type: "default", reason: "Unlocked by default" },
  reading: { type: "default", reason: "Unlocked by default" },
  writing: { type: "default", reason: "Unlocked for Sprint 7.1", },
  geography: {
    type: "coming_soon",
    reason: "Geography Harbor is coming soon.",
    requirement: "Complete the first Science Lab milestone to unlock Geography Harbor.",
  },
  science: {
    type: "default",
  reason: "Unlocked for Sprint 8.1",
  },
  music: {
    type: "coming_soon",
    reason: "Music Meadow is coming soon.",
    requirement: "Complete the first Geography Harbor milestone to unlock Music Meadow.",
  },
};
