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
    id: "electricity-3",
    title: "Complete the Circuit",
    xp: 20,
    successMessage:
      "Brilliant! You matched each circuit part to its job.",
    activities: [
      {
        activityType: "matching",
        prompt: "Match each circuit part to what it does.",
        pairs: [
          { left: "Battery", right: "Provides energy" },
          { left: "Wire", right: "Carries electricity" },
          { left: "Bulb", right: "Produces light" },
          { left: "Switch", right: "Opens or closes the circuit" },
        ],
        options: [
          "Provides energy",
          "Carries electricity",
          "Produces light",
          "Opens or closes the circuit",
        ],
      },
    ],
  },
  {
    id: "electricity-4",
    title: "Build the Circuit",
    xp: 20,
    successMessage:
      "Wonderful! You built a working circuit step by step.",
    activities: [
      {
        activityType: "sequencing",
        prompt: "Put the circuit steps in the correct order.",
        items: [
          { id: "wire", label: "Connect the wire" },
          { id: "battery", label: "Start with the battery" },
          { id: "bulb", label: "Light the bulb" },
          { id: "switch", label: "Add the switch" },
        ],
        correctOrder: ["battery", "wire", "switch", "bulb"],
      },
    ],
  },
  {
    id: "electricity-5",
    title: "What Happens Next?",
    xp: 25,
    successMessage:
      "Excellent prediction! You understand how a simple circuit works.",
    activities: [
      {
        activityType: "prediction",
        prompt: "What happens if the battery is removed from the circuit?",
        options: [
          "The bulb goes out.",
          "The bulb becomes brighter.",
          "Nothing changes.",
          "The wire turns into a battery.",
        ],
        correctIndex: 0,
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