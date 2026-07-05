import { WRITING_BOOKS } from "../writingBooks";
import { WRITING_LESSONS } from "../writingLessons";

export default function WritingBookProgress({ completedLessons }) {
  return (
    <section className="writing-book-progress">
      <p className="quest-realm">Royal Library</p>
      <h2>Books Restored</h2>

      <div className="writing-book-list">
        {WRITING_BOOKS.map((book) => {
          const bookLessons = WRITING_LESSONS.filter(
            (lesson) => lesson.bookId === book.id
          );

          const completedPages = bookLessons.filter((lesson) =>
            completedLessons.includes(lesson.id)
          ).length;

          const progressPercent =
            book.totalPages > 0
              ? Math.round((completedPages / book.totalPages) * 100)
              : 0;

          return (
            <article key={book.id} className="writing-book-card">
              <div className="writing-book-icon">{book.icon}</div>

              <div>
                <h3>{book.title}</h3>
                <p>
                  {completedPages} / {book.totalPages} pages restored
                </p>

                <div className="writing-book-bar">
                  <span style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}