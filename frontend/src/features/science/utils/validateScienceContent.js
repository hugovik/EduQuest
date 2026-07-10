const SUPPORTED_SCIENCE_ACTIVITY_TYPES = new Set([
  "observation",
  "classification",
  "matching",
  "sequencing",
  "prediction",
]);

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateActivityShape(experimentId, activityType, activity) {
  const errors = [];

  if (!activity) {
    return [`${experimentId}: missing activity content.`];
  }

  if (activity.activityType !== activityType) {
    errors.push(
      `${experimentId}: backend activity type is "${activityType}", but frontend activity type is "${activity.activityType}".`
    );
  }

  if (!hasText(activity.prompt)) {
    errors.push(`${experimentId}: activity prompt is missing.`);
  }

  if (activityType === "observation" || activityType === "prediction") {
    if (!Array.isArray(activity.options) || activity.options.length < 2) {
      errors.push(`${experimentId}: ${activityType} activity needs answer options.`);
    }

    if (
      !Number.isInteger(activity.correctIndex) ||
      activity.correctIndex < 0 ||
      activity.correctIndex >= (activity.options?.length ?? 0)
    ) {
      errors.push(`${experimentId}: ${activityType} activity needs a valid correctIndex.`);
    }
  }

  if (activityType === "classification") {
    if (!Array.isArray(activity.categories) || activity.categories.length < 2) {
      errors.push(`${experimentId}: classification activity needs categories.`);
    }

    if (!Array.isArray(activity.items) || activity.items.length === 0) {
      errors.push(`${experimentId}: classification activity needs sortable items.`);
    } else {
      activity.items.forEach((item) => {
        if (!hasText(item.id) || !hasText(item.label) || !hasText(item.category)) {
          errors.push(`${experimentId}: classification item is missing id, label, or category.`);
        }

        if (activity.categories?.includes(item.category) === false) {
          errors.push(`${experimentId}: classification item "${item.id}" uses an unknown category.`);
        }
      });
    }
  }

  if (activityType === "matching") {
    if (!Array.isArray(activity.pairs) || activity.pairs.length === 0) {
      errors.push(`${experimentId}: matching activity needs pairs.`);
    } else {
      activity.pairs.forEach((pair) => {
        if (!hasText(pair.left) || !hasText(pair.right)) {
          errors.push(`${experimentId}: matching pair is missing left or right text.`);
        }
      });
    }

    if (!Array.isArray(activity.options) || activity.options.length === 0) {
      errors.push(`${experimentId}: matching activity needs options.`);
    }
  }

  if (activityType === "sequencing") {
    if (!Array.isArray(activity.items) || activity.items.length === 0) {
      errors.push(`${experimentId}: sequencing activity needs ordered items.`);
    } else {
      activity.items.forEach((item) => {
        if (!hasText(item.id) || !hasText(item.label)) {
          errors.push(`${experimentId}: sequencing item is missing id or label.`);
        }
      });
    }

    if (!Array.isArray(activity.correctOrder) || activity.correctOrder.length !== activity.items?.length) {
      errors.push(`${experimentId}: sequencing activity needs a complete correctOrder.`);
    } else {
      const itemIds = new Set(activity.items.map((item) => item.id));
      activity.correctOrder.forEach((itemId) => {
        if (!itemIds.has(itemId)) {
          errors.push(`${experimentId}: sequencing correctOrder references unknown item "${itemId}".`);
        }
      });
    }
  }

  return errors;
}

export function validateScienceContent({
  registryExperiments = [],
  richExperiments = [],
  lessons = [],
  topics = [],
}) {
  const errors = [];
  const registryById = new Map(
    registryExperiments.map((experiment) => [experiment.id, experiment])
  );
  const richById = new Map(richExperiments.map((experiment) => [experiment.id, experiment]));
  const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  const topicIds = new Set(topics.map((topic) => topic.id));

  registryExperiments.forEach((registryExperiment) => {
    const experimentId = registryExperiment.id;
    const richExperiment = richById.get(experimentId);
    const lesson = lessonById.get(experimentId);
    const activityType = registryExperiment.activity_type ?? registryExperiment.activityType;

    if (!richExperiment) {
      errors.push(`${experimentId}: missing frontend experiment content.`);
    } else {
      if (!hasText(richExperiment.title)) {
        errors.push(`${experimentId}: title is missing.`);
      }
      if (!hasText(richExperiment.description)) {
        errors.push(`${experimentId}: description is missing.`);
      }
    }

    if (!lesson) {
      errors.push(`${experimentId}: missing frontend lesson/activity content.`);
      return;
    }

    if (!SUPPORTED_SCIENCE_ACTIVITY_TYPES.has(activityType)) {
      errors.push(`${experimentId}: unsupported backend activity type "${activityType}".`);
    }

    if (!hasText(lesson.title)) {
      errors.push(`${experimentId}: lesson title is missing.`);
    }
    if (!hasText(lesson.learningObjective)) {
      errors.push(`${experimentId}: learning objective is missing.`);
    }
    if (!Array.isArray(lesson.vocabulary) || lesson.vocabulary.length === 0) {
      errors.push(`${experimentId}: vocabulary array is missing.`);
    }
    if (!hasText(lesson.funFact)) {
      errors.push(`${experimentId}: fun fact is missing.`);
    }
    if (!hasText(lesson.professorMessage)) {
      errors.push(`${experimentId}: Professor Nova message is missing.`);
    }
    if (!Number.isFinite(lesson.estimatedMinutes) || lesson.estimatedMinutes <= 0) {
      errors.push(`${experimentId}: estimated duration is missing.`);
    }
    if (!Number.isFinite(lesson.difficulty) || lesson.difficulty <= 0) {
      errors.push(`${experimentId}: difficulty is missing.`);
    }

    errors.push(
      ...validateActivityShape(
        experimentId,
        activityType,
        lesson.activities?.[0]
      )
    );
  });

  richExperiments.forEach((experiment) => {
    if (!registryById.has(experiment.id)) {
      errors.push(`${experiment.id}: frontend experiment content has no backend registry entry.`);
    }
  });

  lessons.forEach((lesson) => {
    if (!registryById.has(lesson.id)) {
      errors.push(`${lesson.id}: frontend lesson content has no backend registry entry.`);
    }
  });

  registryExperiments.forEach((experiment) => {
    if (!topicIds.has(experiment.topic_id)) {
      errors.push(`${experiment.id}: frontend topic metadata is missing for "${experiment.topic_id}".`);
    }
  });

  return errors;
}
