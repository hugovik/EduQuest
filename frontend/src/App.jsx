import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { BookOpen, Map, Star, Trophy, Home, Mic } from "lucide-react";
import "./styles.css";

const child = {
  name: "Lena",
  level: 1,
  xp: 40,
  nextLevelXp: 100,
  treeStage: "Seedling",
};

const quest = {
  id: "reading-forest-001",
  title: "Professor Owl and the Lost Page",
  realm: "Reading Forest",
  passage:
    "Professor Owl found a lost page near the library tree. Lena helped him read the clues and return the page to the magic book.",
  question: "Who found the lost page?",
  options: ["Captain Beaver", "Professor Owl", "Spark Dragon"],
  answer: "Professor Owl",
  xpReward: 25,
};

function Header({ screen, setScreen }) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">EduQuest Adventures</p>
        <h1>{child.name}'s EduQuest Adventure</h1>
      </div>
      <nav>
        <button onClick={() => setScreen("home")} className={screen === "home" ? "active" : ""}><Home size={18}/> Tree House</button>
        <button onClick={() => setScreen("map")} className={screen === "map" ? "active" : ""}><Map size={18}/> Map</button>
        <button onClick={() => setScreen("reading")} className={screen === "reading" ? "active" : ""}><BookOpen size={18}/> Reading Forest</button>
      </nav>
    </header>
  );
}

function TreeHouse({ earnedXp, certificate }) {
  const currentXp = child.xp + earnedXp;
  return (
    <main className="screen">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Welcome home</p>
          <h2>Hello, {child.name}! Your Tree House is ready.</h2>
          <p>
            Spark Dragon is waiting by the window. Professor Owl has a reading quest in the forest.
          </p>
          <div className="xp-wrap">
            <div className="xp-label">Level {child.level} Explorer · {currentXp}/{child.nextLevelXp} XP</div>
            <div className="xp-bar"><span style={{ width: `${Math.min(100, currentXp)}%` }} /></div>
          </div>
        </div>
        <div className="tree-card">
          <div className="tree-emoji">🌳</div>
          <strong>Tree of Growth</strong>
          <span>{earnedXp > 0 ? "A new leaf appeared!" : child.treeStage}</span>
        </div>
      </section>

      <section className="grid">
        <article className="quest-card">
          <BookOpen />
          <h3>Today's Quest</h3>
          <p>Visit Reading Forest and help Professor Owl recover the lost page.</p>
        </article>
        <article className="quest-card">
          <Star />
          <h3>Reward</h3>
          <p>Earn {quest.xpReward} XP and grow your Tree of Growth.</p>
        </article>
        <article className="quest-card">
          <Trophy />
          <h3>Certificate</h3>
          <p>{certificate ? "Reading Explorer certificate unlocked!" : "Complete your first quest to unlock it."}</p>
        </article>
      </section>
    </main>
  );
}

function WorldMap() {
  return (
    <main className="screen">
      <h2>Adventure Map</h2>
      <div className="world-map">
        <div className="realm reading">📚 Reading Forest</div>
        <div className="realm math">⛰️ Crystal Mountains</div>
        <div className="realm writing">✍️ Story Kingdom</div>
        <div className="realm castle">🏰 Hall of Achievements</div>
      </div>
    </main>
  );
}

function ReadingQuest({ onComplete, completed }) {
  const [selected, setSelected] = useState("");
  const [feedback, setFeedback] = useState("");

  const checkAnswer = () => {
    if (selected === quest.answer) {
      setFeedback("Wonderful reading! You helped Professor Owl return the page.");
      onComplete();
    } else {
      setFeedback("Almost there. Read the story one more time and look for the character who found the page.");
    }
  };

  return (
    <main className="screen">
      <section className="lesson-card">
        <p className="eyebrow">{quest.realm}</p>
        <h2>{quest.title}</h2>
        <p className="passage">{quest.passage}</p>

        <button className="voice-button"><Mic size={18}/> Read Aloud Practice</button>
        <p className="hint">Voice recognition will be connected in the next build. For now, this is the planned entry point.</p>

        <h3>{quest.question}</h3>
        <div className="options">
          {quest.options.map((option) => (
            <button key={option} onClick={() => setSelected(option)} className={selected === option ? "selected" : ""}>
              {option}
            </button>
          ))}
        </div>

        <button className="primary" onClick={checkAnswer}>Finish Quest</button>
        {feedback && <p className={completed ? "success" : "feedback"}>{feedback}</p>}
      </section>
    </main>
  );
}

function App() {
  const [screen, setScreen] = useState("home");
  const [earnedXp, setEarnedXp] = useState(0);
  const [certificate, setCertificate] = useState(false);

  const completeQuest = () => {
    if (!certificate) {
      setEarnedXp(quest.xpReward);
      setCertificate(true);
    }
  };

  return (
    <div className="app">
      <Header screen={screen} setScreen={setScreen} />
      {screen === "home" && <TreeHouse earnedXp={earnedXp} certificate={certificate} />}
      {screen === "map" && <WorldMap />}
      {screen === "reading" && <ReadingQuest onComplete={completeQuest} completed={certificate} />}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
