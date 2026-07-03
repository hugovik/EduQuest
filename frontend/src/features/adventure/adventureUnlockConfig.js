export const adventureUnlockRules = {
  math: { type: "default", reason: "Unlocked by default" },
  reading: { type: "default", reason: "Unlocked by default" },
  writing: {
    type: "coming_soon",
    reason: "Writing Kingdom is coming soon.",
    requirement: "Complete Math Mountains and Reading Forest milestones to unlock Writing Kingdom.",
  },
  geography: {
    type: "coming_soon",
    reason: "Geography Harbor is coming soon.",
    requirement: "Complete the first Science Lab milestone to unlock Geography Harbor.",
  },
  science: {
    type: "coming_soon",
    reason: "Science Lab is coming soon.",
    requirement: "Complete the first Writing Kingdom milestone to unlock Science Lab.",
  },
  music: {
    type: "coming_soon",
    reason: "Music Meadow is coming soon.",
    requirement: "Complete the first Geography Harbor milestone to unlock Music Meadow.",
  },
};
