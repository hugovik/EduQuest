export const SCIENCE_LESSONS = [
  {
    id: "electricity-1",

    title: "What Makes the Bulb Glow?",

    xp: 10,

    successMessage:
      "Excellent! You discovered that the battery provides electricity to the circuit.",

    activities: [
      {
        activityType: "observation",

        prompt: "Which object provides electricity to the circuit?",

        options: [
          "Battery",
          "Paper",
          "Leaf",
          "Spoon",
        ],

        correctIndex: 0,
      },
    ],
  },

  {
    id: "electricity-2",
    title: "Power Source",
    xp: 15,
    successMessage:
      "Excellent! You found objects that can provide energy to a circuit.",
    activities: [
      {
        activityType: "classification",
        prompt: "Sort each object into the correct group.",
        categories: ["Power Source", "Not a Power Source"],
        items: [
          { id: "battery", label: "Battery", category: "Power Source" },
          { id: "solar-cell", label: "Solar Cell", category: "Power Source" },
          { id: "apple", label: "Apple", category: "Not a Power Source" },
          { id: "rock", label: "Rock", category: "Not a Power Source" },
        ],
      },
    ],
  },
  {
  id: "magnets-1",

  title: "Magnet Mystery",

  xp: 15,

  successMessage:
    "Fantastic! You discovered which objects are attracted to magnets.",

  activities: [
    {
      activityType: "classification",

      prompt: "Sort each object into the correct group.",

      categories: [
        "Magnetic",
        "Not Magnetic",
      ],

      items: [
        {
          id: "paperclip",
          label: "Paperclip",
          category: "Magnetic",
        },
        {
          id: "coin",
          label: "Coin",
          category: "Not Magnetic",
        },
        {
          id: "nail",
          label: "Iron Nail",
          category: "Magnetic",
        },
        {
          id: "leaf",
          label: "Leaf",
          category: "Not Magnetic",
        },
      ],
    },
  ],
},

];