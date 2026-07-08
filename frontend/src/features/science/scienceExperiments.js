export const SCIENCE_EXPERIMENTS = [
  {
    id: "electricity-1",
    group: "Electricity",
    title: "Light the Bulb",
    topic: "Electricity",

   intro: {
      professor: "Professor Nova",
      title: "Welcome to the Science Lab!",
      message:
        "Today we're going to discover what makes electricity flow. Gather your equipment and let's begin our first experiment!",
    },

    dialogue: {
      encouragement: "Take your time. Scientists learn by observing carefully!",

      success:
        "Amazing work! The laboratory has a little more power thanks to your discovery.",
      retry:
        "That's okay! Even great scientists learn from mistakes. Let's try again.",

      unlock:
        "Excellent! Your discovery has unlocked the next experiment!",
    },

    equipment: [
      {
        icon: "🔋",
        name: "Battery",
      },
      {
        icon: "🧵",
        name: "Wire",
      },
      {
        icon: "💡",
        name: "Bulb",
      },
    ],

    description:
      "Help Professor Nova connect a simple circuit.",

    status: "locked",
  },
 {
    id: "electricity-2",
    group: "Electricity",
    title: "Power Source",
    topic: "Electricity",
    description: "Find which objects can provide energy to a circuit.",

    intro: {
      professor: "Professor Nova",
      title: "Power Source",
      message:
        "A circuit needs a source of energy. Let's discover which objects can power a simple experiment.",
    },

    dialogue: {
      encouragement:
        "Look for objects that store or provide electrical energy.",
      success:
        "Excellent! You found the power sources that can help the lab run again.",
      retry:
        "Good try! Think about which objects can actually provide electricity.",
      unlock:
        "Great work! The next electricity experiment is ready.",
    },

    equipment: [
      { icon: "🔋", name: "Battery" },
      { icon: "☀️", name: "Solar Cell" },
      { icon: "🍎", name: "Apple" },
      { icon: "🪨", name: "Rock" },
    ],

    status: "locked",
  },

  {
    id: "electricity-3",
    group: "Electricity",
    title: "Complete the Circuit",
    topic: "Electricity",
    description: "Match each circuit part to what it does.",

    intro: {
      professor: "Professor Nova",
      title: "Complete the Circuit",
      message:
        "Every circuit has important parts. Let's match each part to its job so the lab can safely restore more power.",
    },

    dialogue: {
      encouragement:
        "Think about what each part does in a simple circuit.",
      success:
        "Brilliant! You understand the parts of a circuit.",
      retry:
        "Good thinking! Look again at what each part does.",
      unlock:
        "Excellent! You're ready to build a circuit step by step.",
    },

    equipment: [
      { icon: "🔋", name: "Battery" },
      { icon: "🧵", name: "Wire" },
      { icon: "💡", name: "Bulb" },
      { icon: "🔘", name: "Switch" },
    ],

    status: "locked",
  },
  {
    id: "electricity-4",
    group: "Electricity",
    title: "Build the Circuit",
    topic: "Electricity",
    description: "Put the circuit steps in the correct order.",

    intro: {
      professor: "Professor Nova",
      title: "Build the Circuit",
      message:
        "Now that you know the parts of a circuit, let's arrange them in the correct order to make the bulb light up.",
    },

    dialogue: {
      encouragement:
        "Think about where electricity starts and how it travels through the circuit.",
      success:
        "Wonderful! You built a working circuit step by step.",
      retry:
        "Almost! Try tracing the path electricity should follow.",
      unlock:
        "Great work! You're ready to make a scientific prediction.",
    },

    equipment: [
      { icon: "🔋", name: "Battery" },
      { icon: "🧵", name: "Wire" },
      { icon: "🔘", name: "Switch" },
      { icon: "💡", name: "Bulb" },
    ],

    status: "locked",
  },

  {
    id: "electricity-5",
    group: "Electricity",
    title: "What Happens Next?",
    topic: "Electricity",
    description: "Predict what happens when part of a circuit is removed.",

    intro: {
      professor: "Professor Nova",
      title: "What Happens Next?",
      message:
        "Scientists make predictions before they test ideas. Let's predict what happens when a circuit is missing an important part.",
    },

    dialogue: {
      encouragement:
        "Think about what a bulb needs before it can light up.",
      success:
        "Excellent prediction! You understand how a simple circuit works.",
      retry:
        "Good thinking! Try asking: can electricity still flow?",
      unlock:
        "Amazing! You completed the Electricity research topic.",
    },

    equipment: [
      { icon: "🔋", name: "Battery" },
      { icon: "🧵", name: "Wire" },
      { icon: "💡", name: "Bulb" },
    ],

    status: "locked",
  },
  {
    id: "magnets-1",
    group: "Magnetism",
    title: "Magnet Mystery",
    topic: "Magnets",
    description: "Discover which objects are attracted to magnets.",
    equipment: ["Magnet", "Paperclip", "Wood block", "Plastic button"],
    status: "locked",
  
  intro: {
      professor: "Professor Nova",
      title: "Magnet Mystery",
      message:
        "Some objects are attracted to magnets while others are not. Let's investigate together!",        
    },
  dialogue: {
      encouragement: "Look closely before making your choice. Good scientists always observe first.",

      success:
        "Excellent investigation! You've uncovered another scientific secret.",
      retry:
        "That's okay! Even great scientists learn from mistakes. Let's try again.",

      unlock:
        "Excellent! Your discovery has unlocked the next experiment!",
    },
  },
  {
    id: "plants-1",
    group: "Plants",
    title: "Growing Green",
    topic: "Plants",
    description: "Learn what plants need to grow strong and healthy.",
    equipment: ["Seed", "Soil", "Water", "Sunlight"],
    status: "locked",
  },
];