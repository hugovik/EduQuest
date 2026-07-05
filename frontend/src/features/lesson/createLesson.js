import { ACTIVITY_TYPES } from "./lessonTypes";

export function createLesson({
  id,
  title,
  description,
  difficulty = "Easy",
  realm,
  activityType,
  xp = 5,
  prerequisite = null,
  payload = {},
  successMessage = "",
  metadata = {},
}) {
  return {
    id,
    title,
    description,
    difficulty,
    realm,
    activityType,
    xp,
    prerequisite,
    payload,
    successMessage,
    metadata,
  };
}

export { ACTIVITY_TYPES };