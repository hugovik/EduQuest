import { adventureWorlds } from "../../adventure/data/adventureWorlds";

export const mathObstacles =
  adventureWorlds.math.trails.find((trail) => trail.id === "rescue-trail")
    ?.obstacles || [];