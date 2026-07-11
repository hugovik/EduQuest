export const treehouseInteractions = [
  {
    id: "world-map",
    label: "World Map",
    icon: "🗺️",
    description: "Choose where your next adventure begins.",
    actionLabel: "Open Map",
    type: "navigation",
    target: "world",
    mobileOrder: 2,
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: "🎒",
    description: "See the treasures and rewards you've collected.",
    actionLabel: "Open Inventory",
    type: "inventory",
    target: "world-inventory",
    mobileOrder: 8,
  },
  {
    id: "daily-quest",
    label: "Today's Quest",
    icon: "📜",
    description: "See what adventure is waiting today.",
    actionLabel: "Got it",
    type: "quest",
    mobileOrder: 1,
  },
  {
    id: "tree-growth",
    label: "Tree of Growth",
    icon: "🌱",
    description: "See how your learning tree is growing.",
    actionLabel: "Keep Growing",
    type: "growth",
    mobileOrder: 5,
  },
  {
    id: "professor-owl",
    label: "Professor Owl",
    icon: "🦉",
    description: "Ask your mentor for a helpful nudge.",
    actionLabel: "Thanks, Professor",
    type: "mentor",
    mobileOrder: 6,
  },
  {
    id: "spark-dragon",
    label: "Spark Dragon",
    icon: "🐉",
    description: "Check in with your adventure companion.",
    actionLabel: "Let's Go",
    type: "companion",
    mobileOrder: 7,
  },
  {
    id: "settings",
    label: "Settings",
    icon: "⚙️",
    description: "Open the current settings and developer tools.",
    actionLabel: "Open Settings",
    type: "settings",
    target: "settings",
    mobileOrder: 9,
  },
  {
    id: "reading-forest-shortcut",
    label: "Reading Forest Shortcut",
    icon: "📚",
    description: "Build an enchanted bookshelf that can lead straight to Reading Forest.",
    actionLabel: "View Construction",
    type: "shortcut",
    target: "reading",
    mobileOrder: 4,
  },
];

export function getTreehouseInteraction(id) {
  return treehouseInteractions.find((interaction) => interaction.id === id);
}

export function getProfessorOwlMessage({ dailyGoal, player, quest } = {}) {
  const xpPercent = player?.xp_progress_percent ?? 0;

  if (dailyGoal?.completed) {
    return "Today's quest is complete. Your steady practice is making EduQuest brighter.";
  }

  if (quest) {
    return "I've found something exciting for you today. Check the quest board when you're ready.";
  }

  if (xpPercent >= 80) {
    return "You're getting very close to your next level. One more adventure might do it.";
  }

  return "Nothing is waiting on the quest board right now. The World Map is full of adventures.";
}

export function getSparkDragonMessage({ player, worldSummary } = {}) {
  const xp = player?.xp ?? 0;
  const visitedCount = worldSummary?.visited_regions?.length ?? 0;

  if (xp > 0 && visitedCount > 1) {
    return "You earned more XP and explored new places. I knew you could do it.";
  }

  if (visitedCount > 0) {
    return "The World Map is opening up. Shall we explore something amazing?";
  }

  return "The World Map is waiting. I can feel an adventure spark nearby.";
}

export function getTreehouseObjectStatus(id, {
  dailyGoal,
  inventoryCount,
  player,
  readingShortcut,
  worldSummary,
} = {}) {
  if (id === "inventory") {
    return `${inventoryCount ?? 0} collected item${inventoryCount === 1 ? "" : "s"}`;
  }

  if (id === "daily-quest" && dailyGoal) {
    const current = dailyGoal.current_correct_answers ?? 0;
    const target = dailyGoal.target_correct_answers ?? 10;
    return dailyGoal.completed ? "Complete today" : `${current} / ${target} answers`;
  }

  if (id === "tree-growth") {
    return `${player?.tree_stage ?? "Seedling"} · Level ${player?.level ?? 1}`;
  }

  if (id === "world-map") {
    const lastRegion = worldSummary?.last_region;
    return lastRegion ? `Last visited: ${lastRegion}` : "Ready to explore";
  }

  if (id === "reading-forest-shortcut") {
    if (!readingShortcut) {
      return "Construction details loading";
    }

    if (readingShortcut.completed) {
      return "Shortcut complete";
    }

    if (!readingShortcut.eligible) {
      return `${readingShortcut.current_progress ?? 0} / ${readingShortcut.required_progress ?? 3} passages`;
    }

    return `Stage ${readingShortcut.stage} / ${readingShortcut.maximum_stage}`;
  }

  return null;
}
