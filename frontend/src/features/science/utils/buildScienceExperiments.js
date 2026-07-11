import { validateScienceContent } from "./validateScienceContent.js";

export function buildScienceExperiments({
  registryExperiments = [],
  richExperiments = [],
  lessons = [],
  topics = [],
  completedExperimentIds = [],
}) {
  const richById = new Map(richExperiments.map((experiment) => [experiment.id, experiment]));
  const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  const topicById = new Map(topics.map((topic) => [topic.id, topic]));
  const completedIds = new Set(completedExperimentIds);
  const validationErrors = validateScienceContent({
    registryExperiments,
    richExperiments,
    lessons,
    topics,
  });

  if (import.meta.env?.DEV && validationErrors.length > 0) {
    console.error(
      `Science content validation failed:\n${validationErrors.join("\n")}`
    );
  }

  return registryExperiments
    .map((registryExperiment) => {
      const richExperiment = richById.get(registryExperiment.id) ?? {};
      const lesson = lessonById.get(registryExperiment.id);
      const topic = topicById.get(registryExperiment.topic_id);
      const topicTitle = topic?.title ?? registryExperiment.topic_id ?? "Science";
      const xpReward = registryExperiment.xp_reward ?? registryExperiment.xp ?? lesson?.xp ?? 0;

      return {
        ...richExperiment,
        id: registryExperiment.id,
        title: richExperiment.title ?? registryExperiment.title ?? "Science Mission",
        description:
          richExperiment.description ??
          "This Science Lab mission is not ready yet.",
        equipment: richExperiment.equipment ?? [],
        group: topicTitle,
        topic: topicTitle,
        topicId: registryExperiment.topic_id,
        activityType: registryExperiment.activity_type,
        xpReward,
        xp: xpReward,
        order: registryExperiment.order,
        requires: registryExperiment.requires ?? null,
        completed: completedIds.has(registryExperiment.id),
        hasRichContent: Boolean(richById.has(registryExperiment.id)),
        hasLesson: Boolean(lesson),
        lesson,
        topicMeta: topic,
      };
    })
    .sort((left, right) => {
      const leftTopicOrder = left.topicMeta?.order ?? 0;
      const rightTopicOrder = right.topicMeta?.order ?? 0;

      if (leftTopicOrder !== rightTopicOrder) {
        return leftTopicOrder - rightTopicOrder;
      }

      return (left.order ?? 0) - (right.order ?? 0);
    });
}

export function groupScienceExperimentsByTopic(experiments = []) {
  return experiments.reduce((groups, experiment) => {
    const topicId = experiment.topicId ?? "unknown";

    if (!groups[topicId]) {
      groups[topicId] = [];
    }

    groups[topicId].push(experiment);

    return groups;
  }, {});
}

export function isScienceExperimentUnlocked(experiment, completedExperimentIds = []) {
  if (!experiment?.requires) {
    return true;
  }

  return completedExperimentIds.includes(experiment.requires);
}
