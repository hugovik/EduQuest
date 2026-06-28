import { BookOpen, Star, Trophy } from "lucide-react";

export function TreeHousePage() {
  return (
    <main className="screen">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Welcome home</p>
          <h2>Hello, Lena! Your Tree House is ready.</h2>
          <p>
            Spark Dragon is waiting by the window. Professor Owl has a reading
            quest in the forest.
          </p>

          <div className="xp-wrap">
            <div className="xp-label">Level 1 Explorer · 40/100 XP</div>
            <div className="xp-bar">
              <span style={{ width: "40%" }} />
            </div>
          </div>
        </div>

        <div className="tree-card">
          <div className="tree-emoji">🌳</div>
          <strong>Tree of Growth</strong>
          <span>Seedling</span>
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
          <p>Earn 25 XP and grow your Tree of Growth.</p>
        </article>

        <article className="quest-card">
          <Trophy />
          <h3>Certificate</h3>
          <p>Complete your first quest to unlock it.</p>
        </article>
      </section>
    </main>
  );
}