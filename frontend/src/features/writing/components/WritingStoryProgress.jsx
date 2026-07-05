import { WRITING_LESSONS } from "../writingLessons";
import { WRITING_STORIES } from "../writingStories";

export default function WritingStoryProgress({ completedLessons }) {
  return (
    <section className="writing-book-progress">
      <p className="quest-realm">Story Builder</p>
      <h2>Unlocked Story Chapters</h2>

      <div className="writing-book-list">
        {WRITING_STORIES.map((story) => {
          const completedPages = WRITING_LESSONS.filter(
            (lesson) =>
              lesson.bookId === story.bookId &&
              completedLessons.includes(lesson.id)
          ).length;

          const storyComplete = story.chapters.every(
            (chapter) => completedPages >= chapter.unlockPageCount
          );

          return (
            <div key={story.id}>
              <article className="writing-book-card">
                <div className="writing-book-icon">
                  {storyComplete ? "📚" : "📖"}
                </div>

                <div>
                  <h3>{story.title}</h3>

                  <p>
                    {completedPages} /{" "}
                    {
                      WRITING_LESSONS.filter(
                        (lesson) => lesson.bookId === story.bookId
                      ).length
                    }{" "}
                    pages restored
                  </p>

                  {storyComplete && (
                    <div className="success-message">
                      ✨ Story Complete! <strong>{story.title}</strong> has been
                      fully restored.
                    </div>
                  )}
                </div>
              </article>

              {story.chapters.map((chapter) => {
                const unlocked =
                  completedPages >= chapter.unlockPageCount;

                return (
                  <article
                    key={chapter.id}
                    className={`writing-book-card ${
                      !unlocked ? "locked" : ""
                    }`}
                  >
                    <div className="writing-book-icon">
                      {unlocked ? "📖" : "🔒"}
                    </div>

                    <div>
                      <h3>{chapter.title}</h3>

                      <p>
                        {unlocked
                          ? chapter.text
                          : `Restore ${chapter.unlockPageCount} page(s) to unlock.`}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
}