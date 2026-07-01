function normalizeVocabularyItem(item) {
  if (typeof item === "string") {
    return {
      word: item,
      definition: "A new Reading Forest word.",
      example: null,
    };
  }

  return item;
}

export default function ReadingPassage({ passage }) {
  const vocabularyWords = passage.vocabulary_words.map(normalizeVocabularyItem);

  return (
    <section className="card reading-passage-card">
      <p className="quest-realm">Reading Forest Story</p>
      <h2>{passage.title}</h2>
      <p>{passage.estimated_reading_time}</p>
      <p className="reading-passage-text">{passage.text}</p>

      <section className="reading-vocabulary-section" aria-label="Vocabulary words">
        <p className="quest-realm">New Words</p>
        <h3>Vocabulary Words</h3>
        <div className="reading-vocabulary">
          {vocabularyWords.map((item) => (
            <article className="reading-vocabulary-card" key={item.word}>
              <strong>{item.word}</strong>
              <p>{item.definition}</p>
              {item.example && <small>Example: {item.example}</small>}
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
