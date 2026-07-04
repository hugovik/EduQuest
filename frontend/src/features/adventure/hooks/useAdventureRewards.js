export function useAdventureRewards(reward = {}) {
  const xp = reward.xp ?? reward.xp_earned ?? 0;
  const items = reward.items ?? [];
  const achievements = reward.achievements ?? reward.achievements_unlocked ?? [];

  return {
    xp,
    items,
    achievements,
    hasRewards: xp > 0 || items.length > 0 || achievements.length > 0,
  };
}
