import { ADVENTURE_STATUS, ADVENTURE_THEMES } from "./adventureTypes.js";

export const adventureRegistry = [
  {
    id: "tree-house",
    title: "Tree House",
    description: "Return home, check your tree, and see today's quest.",
    icon: "🌳",
    route: "treehouse",
    status: ADVENTURE_STATUS.playable,
    subject: "home",
    theme: ADVENTURE_THEMES.home,
    isPlayable: true,
    isComingSoon: false,
    requiredRegions: [],
  },
  {
    id: "math-mountains",
    title: "Math Mountains",
    description: "Clear mountain obstacles by solving number challenges.",
    icon: "⛰️",
    route: "math",
    status: ADVENTURE_STATUS.playable,
    subject: "math",
    theme: ADVENTURE_THEMES.math,
    isPlayable: true,
    isComingSoon: false,
    requiredRegions: [],
  },
  {
    id: "reading-forest",
    title: "Reading Forest",
    description: "Follow forest stories, clues, and comprehension quests.",
    icon: "📖",
    route: "reading",
    status: ADVENTURE_STATUS.playable,
    subject: "reading",
    theme: ADVENTURE_THEMES.reading,
    isPlayable: true,
    isComingSoon: false,
    requiredRegions: [],
  },
  {
    id: "writing-kingdom",
    title: "Writing Kingdom",
    description: "Build sentences, stories, and brave royal messages.",
    icon: "🏰",
    route: "writing",
    status: ADVENTURE_STATUS.comingSoon,
    subject: "writing",
    theme: ADVENTURE_THEMES.writing,
    isPlayable: false,
    isComingSoon: true,
    requiredRegions: ["math-mountains", "reading-forest"],
  },
  {
    id: "science-lab",
    title: "Science Lab",
    description: "Experiment, observe, and unlock curious discoveries.",
    icon: "🔬",
    route: "science",
    status: ADVENTURE_STATUS.comingSoon,
    subject: "science",
    theme: ADVENTURE_THEMES.science,
    isPlayable: false,
    isComingSoon: true,
    requiredRegions: ["writing-kingdom"],
  },
  {
    id: "geography-island",
    title: "Geography Island",
    description: "Sail maps, places, landforms, and world clues.",
    icon: "⚓",
    route: "geography",
    status: ADVENTURE_STATUS.comingSoon,
    subject: "geography",
    theme: ADVENTURE_THEMES.geography,
    isPlayable: false,
    isComingSoon: true,
    requiredRegions: ["science-lab"],
  },
  {
    id: "music-valley",
    title: "Music Valley",
    description: "Explore rhythm, sound, and musical patterns.",
    icon: "🎵",
    route: "music",
    status: ADVENTURE_STATUS.comingSoon,
    subject: "music",
    theme: ADVENTURE_THEMES.music,
    isPlayable: false,
    isComingSoon: true,
    requiredRegions: ["geography-island"],
  },
];

export function getAdventureById(adventureId) {
  return adventureRegistry.find((adventure) => adventure.id === adventureId);
}

export function getAdventureBySubject(subject) {
  return adventureRegistry.find((adventure) => adventure.subject === subject);
}

export function getAdventureByRoute(route) {
  return adventureRegistry.find((adventure) => adventure.route === route);
}
