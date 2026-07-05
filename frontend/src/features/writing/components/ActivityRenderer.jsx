import MissingPunctuationActivity from "./MissingPunctuationActivity";
import MissingCapitalActivity from "./MissingCapitalActivity";

export default function ActivityRenderer({ lesson, onComplete }) {
  switch (lesson.activityType) {
    case "missing-punctuation":
      return (
        <MissingPunctuationActivity lesson={lesson} onComplete={onComplete} />
      );

    case "missing-capital":
      return (
        <MissingCapitalActivity lesson={lesson} onComplete={onComplete} />
      );

    default:
      return (
        <section className="card state-card">
          <h2>Unknown Activity</h2>
          <p>Activity type "{lesson.activityType}" is not implemented yet.</p>
        </section>
      );
  }
}