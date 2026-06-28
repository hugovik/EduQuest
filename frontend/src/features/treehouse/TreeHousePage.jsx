import { BookOpen, Star, Trophy } from "lucide-react";
import { useChild } from "../profile/useChild";

export function TreeHousePage() {
  const { data: child, isLoading, error } = useChild();

  if (isLoading) {
    return <main className="screen">Loading Tree House...</main>;
  }

  if (error) {
    return <main className="screen">Unable to load Tree House.</main>;
  }

  const xpPercent = Math.min(100, child.xp);

  return (
    <main className="screen">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Welcome home</p>
          <h2>Hello, {child.name}! Your Tree House is ready.</h2>
          <p>
            Spark Dragon is waiting by the window. Professor Owl has a reading
            quest in the forest.
          </p>

          <div className="xp-wrap">
            <div className="xp-label">
              Level {child.level} Explorer · {child.xp}/100 XP
            </div>
            <div className="xp-bar">
              <span style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="tree-card">
          <div className="tree-emoji">🌳</div>
          <strong>Tree of Growth</strong>
          <span>{child.tree_stage}</span>
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