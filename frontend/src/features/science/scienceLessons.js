export const SCIENCE_LESSONS = [
  {
    id: "electricity-1",
        curriculum: {
        grade: 2,
        subject: "Science",
        strand: "Electricity and Magnetism"
    },
    professorMessage:
        "A bulb needs the right parts to light up. Let's discover what electricity needs to travel.",
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
    learningObjective:
      "Learn that electricity can make a light bulb shine when all the parts are connected correctly.",

    vocabulary: [
      "electricity",
      "battery",
      "bulb",
      "wire"
    ],

    funFact:
      "A tiny battery stores energy that can travel through wires to light a bulb.",

    estimatedMinutes: 5,

    difficulty: 1,
  },
  {
    id: "electricity-2",
    curriculum: {
      grade: 2,
      subject: "Science",
      strand: "Electricity and Magnetism"
    },
    professorMessage:
        "Many things around us need power. Let's find which objects use electricity.",
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
    learningObjective:
      "Identify common objects that use electricity as a source of power.",

    vocabulary: [
      "power",
      "battery",
      "electricity",
      "energy"
    ],

    funFact:
      "Some toys use batteries, while others plug into a wall for electricity.",

    estimatedMinutes: 5,

    difficulty: 1,
  },
  {
    id: "electricity-3",
    curriculum: {
      grade: 2,
      subject: "Science",
      strand: "Electricity and Magnetism"
    },
    professorMessage:
        "Electricity needs a complete path. Let's connect the pieces and see what happens.",
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
    learningObjective:
      "Understand that electricity needs a complete circuit to flow.",

    vocabulary: [
      "circuit",
      "flow",
      "connect",
      "wire"
    ],

    funFact:
      "If there is even one small gap in a circuit, electricity cannot flow.",

    estimatedMinutes: 6,

    difficulty: 1,
  },
  {
    id: "electricity-4",
    curriculum: {
      grade: 2,
      subject: "Science",
      strand: "Electricity and Magnetism"
    },
    professorMessage:
        "Building a circuit is like following a recipe. Let's put the steps in the right order.",
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
    learningObjective:
      "Learn the correct order for building a simple electrical circuit.",

    vocabulary: [
      "battery",
      "wire",
      "bulb",
      "circuit"
    ],

    funFact:
      "Real engineers test their circuits one step at a time to make sure everything works safely.",

    estimatedMinutes: 6,

    difficulty: 1,
  },
  {
    id: "electricity-5",
    curriculum: {
      grade: 2,
      subject: "Science",
      strand: "Electricity and Magnetism"
    },
    professorMessage:
      "Scientists make predictions before they test. What do you think will happen next?",
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
    learningObjective:
      "Predict what will happen when parts of a circuit are changed.",

    vocabulary: [
      "predict",
      "switch",
      "circuit",
      "observe"
    ],

    funFact:
      "Scientists make predictions before they do an experiment, then compare their ideas with the results.",

    estimatedMinutes: 6,

    difficulty: 1,
  },
  {
    id: "magnets-1",
    curriculum: {
        grade: 2,
        subject: "Science",
        strand: "Electricity and Magnetism"
    },
    professorMessage:
      "Have you ever seen a magnet pull something without touching it? Let's find out how that works.",
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
    learningObjective:
      "Learn that magnets can pull some objects without touching them.",
    vocabulary: ["magnet", "pull", "attract"],
    funFact:
      "Magnets can pull some objects even through paper or thin cardboard.",
    estimatedMinutes: 5,
    difficulty: 1,
  },
  {
    id: "magnets-2",
        curriculum: {
        grade: 2,
        subject: "Science",
        strand: "Electricity and Magnetism"
    },
    professorMessage:
        "Some objects stick to magnets and some do not. Let's test them like real scientists.",
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
    learningObjective:
      "Learn that magnets attract some metal objects but not all materials.",
    vocabulary: ["magnetic", "metal", "plastic", "wood"],
    funFact:
      "Most magnets attract iron and steel, but they do not attract wood or plastic.",
    estimatedMinutes: 5,
    difficulty: 1,
  },
  {
    id: "magnets-3",
    curriculum: {
        grade: 2,
        subject: "Science",
        strand: "Electricity and Magnetism"
    },
    professorMessage:
      "Not all magnets are the same strength. Let's compare their pulling power.",
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
    learningObjective:
      "Compare stronger and weaker magnets by what they can pull.",
    vocabulary: ["strong", "weak", "force", "pull"],
    funFact:
      "A stronger magnet can pull objects from farther away than a weaker magnet.",
    estimatedMinutes: 6,
    difficulty: 1,
  },
  {
    id: "magnets-4",
    curriculum: {
        grade: 2,
        subject: "Science",
        strand: "Electricity and Magnetism"
    },
    professorMessage:
        "A mystery magnet is hiding in the lab. Careful testing will help us find it.",
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
    learningObjective:
      "Use careful steps to investigate and find a hidden magnet.",
    vocabulary: ["observe", "test", "evidence", "investigate"],
    funFact:
      "Scientists often follow steps so they can explain how they found an answer.",
    estimatedMinutes: 6,
    difficulty: 1,
  },
  {
    id: "magnets-5",
    curriculum: {
        grade: 2,
        subject: "Science",
        strand: "Electricity and Magnetism"
    },
    professorMessage:
        "A compass has a tiny magnet inside. Let's discover how it helps people find direction.",
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
    learningObjective:
      "Learn that a compass uses magnetism to point direction.",
    vocabulary: ["compass", "direction", "needle", "north"],
    funFact:
      "A compass needle is a tiny magnet that points toward Earth’s magnetic north.",
    estimatedMinutes: 6,
    difficulty: 1,
  },
];
