export const adventureWorlds = {
  math: {
    id: "math",
    title: "Math Mountains",
    emoji: "⛰️",
    description:
      "A mountain trail filled with bridges, rockfalls, and rescue tasks that can be solved with math.",
    trails: [
      {
        id: "rescue-trail",
        title: "Rescue Trail",
        description:
          "A flash flood damaged the mountain path. Lena needs to help the workers reopen the trail.",
        obstacles: [
          {
            id: "broken-bridge-001",
            title: "Broken Bridge",
            emoji: "🌉",
            type: "construction",
            operation: "addition",
            materialName: "bricks",
            materialEmoji: "🧱",
            totalMaterialsNeeded: 4,
            correctAnswersPerMaterial: 2,
            intro:
              "A flash flood damaged the bridge on the mountain trail. The workers need bricks to repair it.",
            success:
              "The bridge is repaired! Lena can continue deeper into Math Mountains.",
          },
          {
            id: "rockfall-001",
            title: "Rockfall",
            emoji: "🪨",
            type: "clearing",
            operation: "subtraction",
            materialName: "rocks cleared",
            materialEmoji: "⛏️",
            totalMaterialsNeeded: 4,
            correctAnswersPerMaterial: 2,
            intro:
              "A rockfall blocked the hiking trail. Lena needs to help the workers calculate how many rocks are left to clear.",
            success:
              "The rockfall is cleared! The hiking trail is safe again.",
          },
        ],
      },
    ],
  },
};