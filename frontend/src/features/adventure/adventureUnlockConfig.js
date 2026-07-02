export const adventureUnlockRules = {
  math: { type: "default", reason: "Unlocked by default" },
  reading: { type: "default", reason: "Unlocked by default" },
  writing: { type: "default", reason: "Unlocked by default" },
  story: {
    type: "completed_quests",
    adventure: "reading",
    required: 3,
    reason: "Complete 3 Reading Forest quests to unlock Story Cave",
  },
  geography: {
    type: "completed_quests",
    adventure: "math",
    required: 2,
    reason: "Complete 2 Math Mountains quests to unlock Geography Trail",
  },
  science: {
    type: "total_xp",
    required: 100,
    reason: "Earn 100 XP to unlock Science Lab",
  },
  music: {
    type: "achievement_or_xp",
    requiredXp: 150,
    requiredAchievements: 1,
    reason: "Unlock your first achievement or earn 150 XP to open Music Meadow",
  },
};
