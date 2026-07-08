import MissingPunctuationActivity from "./MissingPunctuationActivity";
import MissingCapitalActivity from "./MissingCapitalActivity";
import MissingWordActivity from "./MissingWordActivity";
import SentenceOrderingActivity from "./SentenceOrderingActivity";
import GrammarChoiceActivity from "./GrammarChoiceActivity";
import ObservationActivity from "./ObservationActivity.jsx";
import ClassificationActivity from "./ClassificationActivity.jsx";
import MatchingActivity from "./MatchingActivity.jsx";
import SequencingActivity from "./SequencingActivity.jsx";
import PredictionActivity from "./PredictionActivity.jsx";

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
    
    case "missing-word":
        return (
            <MissingWordActivity lesson={lesson} onComplete={onComplete} />
        );
    
    case "sentence-ordering":
        return (
            <SentenceOrderingActivity lesson={lesson} onComplete={onComplete} />
        );

    case "grammar-choice":
        return (
            <GrammarChoiceActivity lesson={lesson} onComplete={onComplete} />
        );

    case "observation":
        return (
          <ObservationActivity
           activity={lesson}
           onComplete={onComplete}
          />
        );

    case "classification":
      return (
        <ClassificationActivity
          activity={lesson}
          onComplete={onComplete}
        />
      );

    case "matching":
      return (
        <MatchingActivity
          lesson={lesson}
          onComplete={onComplete}
        />
      );

    case "sequencing":
      return (
        <SequencingActivity
          lesson={lesson}
          onComplete={onComplete}
        />
      );

    case "prediction":
      return (
        <PredictionActivity
          lesson={lesson}
          onComplete={onComplete}
        />
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