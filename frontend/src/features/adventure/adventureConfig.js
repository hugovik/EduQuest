export const adventures = [
  {
    id: "math",
    name: "Math Mountains",
    route: "math",
    icon: "⛰️",
    description: "Repair bridges and solve number challenges.",
    enabled: true,
    status: "Ready",
  },
  {
    id: "reading",
    name: "Reading Forest",
    route: "reading",
    icon: "📖",
    description: "Explore story paths and discover new words.",
    enabled: false,
    status: "Coming Soon",
  },
  {
    id: "writing",
    name: "Writing Kingdom",
    route: "writing",
    icon: "✏️",
    description: "Build sentences, tales, and royal messages.",
    enabled: false,
    status: "Coming Soon",
  },
  {
    id: "story",
    name: "Story Cave",
    route: "story",
    icon: "🕯️",
    description: "Find hidden ideas and shape them into adventures.",
    enabled: false,
    status: "Coming Soon",
  },
  {
    id: "geography",
    name: "Geography Trail",
    route: "geography",
    icon: "🗺️",
    description: "Follow maps, places, and world clues.",
    enabled: false,
    status: "Coming Soon",
  },
  {
    id: "science",
    name: "Science Lab",
    route: "science",
    icon: "🔬",
    description: "Test ideas and investigate how things work.",
    enabled: false,
    status: "Coming Soon",
  },
  {
    id: "music",
    name: "Music Meadow",
    route: "music",
    icon: "🎵",
    description: "Play with rhythm, pitch, and sound patterns.",
    enabled: false,
    status: "Coming Soon",
  },
];

export function getAdventureById(adventureId) {
  return adventures.find((adventure) => adventure.id === adventureId);
}
