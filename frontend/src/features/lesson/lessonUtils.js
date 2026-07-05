import { LESSON_STATUS } from "./lessonTypes";

export function isLessonCompleted(lesson, completedLessonIds) {
  return completedLessonIds.includes(lesson.id);
}

export function isLessonUnlocked(lesson, completedLessonIds) {
  return !lesson.prerequisite || completedLessonIds.includes(lesson.prerequisite);
}

export function getLessonStatus(lesson, completedLessonIds) {
  if (isLessonCompleted(lesson, completedLessonIds)) {
    return LESSON_STATUS.completed;
  }

  if (isLessonUnlocked(lesson, completedLessonIds)) {
    return LESSON_STATUS.available;
  }

  return LESSON_STATUS.locked;
}

export function getTotalLessonXp(lessons) {
  return lessons.reduce((total, lesson) => total + (lesson.xp || 0), 0);
}

export function getEarnedLessonXp(lessons, completedLessonIds) {
  return lessons
    .filter((lesson) => completedLessonIds.includes(lesson.id))
    .reduce((total, lesson) => total + (lesson.xp || 0), 0);
}

export function getCompletedBooks(lessons, completedLessonIds) {
  const completedBookIds = new Set();

  const groupedLessons = lessons.reduce((books, lesson) => {
    if (!books[lesson.bookId]) {
      books[lesson.bookId] = [];
    }

    books[lesson.bookId].push(lesson);
    return books;
  }, {});

  Object.entries(groupedLessons).forEach(([bookId, bookLessons]) => {
    const allCompleted = bookLessons.every((lesson) =>
      completedLessonIds.includes(lesson.id)
    );

    if (allCompleted) {
      completedBookIds.add(bookId);
    }
  });

  return completedBookIds.size;
}