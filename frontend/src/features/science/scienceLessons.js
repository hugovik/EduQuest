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
        options: ["Battery", "Paper", "Leaf", "Spoon"],
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
    successMessage: "Brilliant! You matched each circuit part to its job.",
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
    successMessage: "Wonderful! You built a working circuit step by step.",
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
      "Great observing! You discovered that magnets pull some objects but not others.",
    activities: [
      {
        activityType: "observation",
        prompt: "Which object is most likely to be pulled by a magnet?",
        options: ["Paper clip", "Wooden stick", "Plastic cup", "Leaf"],
        correctIndex: 0,
      },
    ],
  },
  {
    id: "magnets-2",
    title: "Magnetic or Not?",
    xp: 15,
    successMessage:
      "Excellent sorting! You found which objects are magnetic.",
    activities: [
      {
        activityType: "classification",
        prompt: "Sort each object into the correct group.",
        categories: ["Magnetic", "Not Magnetic"],
        items: [
          { id: "spoon", label: "Steel spoon", category: "Magnetic" },
          { id: "coin", label: "Coin", category: "Not Magnetic" },
          { id: "plastic-cup", label: "Plastic cup", category: "Not Magnetic" },
          { id: "wooden-stick", label: "Wooden stick", category: "Not Magnetic" },
          { id: "paper-clip", label: "Paper clip", category: "Magnetic" },
          { id: "aluminum-can", label: "Aluminum can", category: "Not Magnetic" },
        ],
      },
    ],
  },
  {
    id: "magnets-3",
    title: "Strong vs Weak",
    xp: 20,
    successMessage: "Brilliant! You matched each magnet to its description.",
    activities: [
      {
        activityType: "matching",
        prompt: "Match each magnet with the best description.",
        pairs: [
          { left: "Bar magnet", right: "Strong pull" },
          { left: "Small fridge magnet", right: "Weak pull" },
          { left: "Horseshoe magnet", right: "Strong pull" },
          { left: "Fridge note magnet", right: "Common household use" },
        ],
        options: ["Strong pull", "Weak pull", "Common household use"],
      },
    ],
  },
  {
    id: "magnets-4",
    title: "Find the Hidden Magnet",
    xp: 20,
    successMessage:
      "Fantastic! You followed the clues and found the hidden magnet.",
    activities: [
      {
        activityType: "sequencing",
        prompt: "Put the steps in order to find the hidden magnet.",
        items: [
          { id: "observe", label: "Observe attraction" },
          { id: "find", label: "Find the magnet" },
          { id: "test", label: "Test nearby objects" },
          { id: "tool", label: "Choose a tool" },
        ],
        correctOrder: ["tool", "test", "observe", "find"],
      },
    ],
  },
  {
    id: "magnets-5",
    title: "Compass Adventure",
    xp: 25,
    successMessage:
      "Excellent prediction! You learned how a compass reacts to magnets.",
    activities: [
      {
        activityType: "prediction",
        prompt: "What happens when a magnet moves closer to a compass?",
        options: [
          "The compass needle can move toward the magnet.",
          "The compass disappears.",
          "The compass turns into wood.",
          "Nothing can ever change a compass needle.",
        ],
        correctIndex: 0,
      },
    ],
  },
];
