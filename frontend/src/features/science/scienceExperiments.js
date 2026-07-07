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