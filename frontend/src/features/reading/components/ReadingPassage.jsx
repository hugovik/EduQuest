export default function ReadingPassage({ passage }) {
  return (
    <section className="card reading-passage-card">
      <p className="quest-realm">Reading Forest Story</p>
      <h2>{passage.title}</h2>
      <p>{passage.estimated_reading_time}</p>
      <p className="reading-passage-text">{passage.text}</p>
      <div className="reading-vocabulary">
        {passage.vocabulary_words.map((word) => (
          <span key={word}>{word}</span>
        ))}
      </div>
    </section>
  );
}
