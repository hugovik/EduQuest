export const SCIENCE_EXPERIMENTS = [
  {
    id: "electricity-1",
    group: "Electricity",
    title: "Light the Bulb",
    topic: "Electricity",
    description: "Help Professor Nova connect a simple circuit.",
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
      unlock: "Excellent! Your discovery has unlocked the next experiment!",
    },
    equipment: [
      { icon: "🔋", name: "Battery" },
      { icon: "🧵", name: "Wire" },
      { icon: "💡", name: "Bulb" },
    ],
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
      encouragement: "Look for objects that store or provide electrical energy.",
      success:
        "Excellent! You found the power sources that can help the lab run again.",
      retry:
        "Good try! Think about which objects can actually provide electricity.",
      unlock: "Great work! The next electricity experiment is ready.",
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
      encouragement: "Think about what each part does in a simple circuit.",
      success: "Brilliant! You understand the parts of a circuit.",
      retry: "Good thinking! Look again at what each part does.",
      unlock: "Excellent! You're ready to build a circuit step by step.",
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
      success: "Wonderful! You built a working circuit step by step.",
      retry: "Almost! Try tracing the path electricity should follow.",
      unlock: "Great work! You're ready to make a scientific prediction.",
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
      encouragement: "Think about what a bulb needs before it can light up.",
      success:
        "Excellent prediction! You understand how a simple circuit works.",
      retry: "Good thinking! Try asking: can electricity still flow?",
      unlock: "Amazing! You completed the Electricity research topic.",
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
    topic: "Magnetism",
    description: "Observe objects and discover what magnets can pull.",
    intro: {
      professor: "Professor Nova",
      title: "Magnetism Begins",
      message:
        "Magnets have an invisible pull. Let's look closely and find out what makes them special!",
    },
    dialogue: {
      encouragement:
        "Look at each object before you choose. Careful observing helps scientists learn.",
      success:
        "Great observing! You found that magnets pull some objects but not others.",
      retry: "Good try! Look for objects made with iron or steel.",
      unlock: "Nice work! The next Magnetism experiment is ready.",
    },
    equipment: [
      { icon: "🧲", name: "Magnet" },
      { icon: "📎", name: "Paper clip" },
      { icon: "🥄", name: "Spoon" },
      { icon: "🪵", name: "Wooden stick" },
    ],
    status: "locked",
  },
  {
    id: "magnets-2",
    group: "Magnetism",
    title: "Magnetic or Not?",
    topic: "Magnetism",
    description: "Sort everyday objects by whether a magnet pulls them.",
    intro: {
      professor: "Professor Nova",
      title: "Magnetic or Not?",
      message:
        "Some objects stick to magnets. Others do not. Let's sort them like real lab scientists!",
    },
    dialogue: {
      encouragement:
        "Think about what each object is made from before you sort it.",
      success: "Excellent sorting! You spotted the magnetic objects.",
      retry: "Try again. Metal can be tricky, because not every metal is magnetic.",
      unlock: "Well done! Let's compare magnet strength next.",
    },
    equipment: [
      { icon: "🥄", name: "Spoon" },
      { icon: "🪙", name: "Coin" },
      { icon: "🥤", name: "Plastic cup" },
      { icon: "📎", name: "Paper clip" },
    ],
    status: "locked",
  },
  {
    id: "magnets-3",
    group: "Magnetism",
    title: "Strong vs Weak",
    topic: "Magnetism",
    description: "Match magnets with how they are used.",
    intro: {
      professor: "Professor Nova",
      title: "Strong vs Weak",
      message:
        "Magnets can have strong pulls or gentle pulls. Let's match each magnet to what it does best.",
    },
    dialogue: {
      encouragement: "Read each clue and think about where you might see that magnet.",
      success: "Brilliant! You matched each magnet with its job.",
      retry: "Almost. Try matching the shape to the clue.",
      unlock: "Great match! A hidden magnet mystery is waiting.",
    },
    equipment: [
      { icon: "🧲", name: "Bar magnet" },
      { icon: "🧲", name: "Horseshoe magnet" },
      { icon: "🧊", name: "Fridge magnet" },
    ],
    status: "locked",
  },
  {
    id: "magnets-4",
    group: "Magnetism",
    title: "Find the Hidden Magnet",
    topic: "Magnetism",
    description: "Put the investigation steps in the correct order.",
    intro: {
      professor: "Professor Nova",
      title: "Find the Hidden Magnet",
      message:
        "A magnet is hidden in the lab. We can find it by testing objects step by step.",
    },
    dialogue: {
      encouragement:
        "Think like a scientist: choose a tool, test, observe, then decide.",
      success: "Fantastic! You followed the clues and found the magnet.",
      retry: "Good thinking. Try putting the testing steps in order.",
      unlock: "Wonderful! Your compass adventure is unlocked.",
    },
    equipment: [
      { icon: "🧲", name: "Test magnet" },
      { icon: "📦", name: "Mystery box" },
      { icon: "📋", name: "Observation sheet" },
    ],
    status: "locked",
  },
  {
    id: "magnets-5",
    group: "Magnetism",
    title: "Compass Adventure",
    topic: "Magnetism",
    description: "Predict how a compass reacts near a magnet.",
    intro: {
      professor: "Professor Nova",
      title: "Compass Adventure",
      message:
        "A compass can help us explore magnetism. Let's predict what happens when a magnet moves nearby.",
    },
    dialogue: {
      encouragement:
        "A compass needle reacts to magnetic pulls. Choose the best prediction.",
      success: "Excellent prediction! You completed the Magnetism topic.",
      retry: "Try again. Think about what happens when a magnet gets closer.",
      unlock: "Amazing! Magnetism is now part of our Science Lab discoveries.",
    },
    equipment: [
      { icon: "🧭", name: "Compass" },
      { icon: "🧲", name: "Magnet" },
      { icon: "🗺️", name: "Lab map" },
    ],
    status: "locked",
  },
];
