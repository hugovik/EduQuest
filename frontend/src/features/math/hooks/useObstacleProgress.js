import { useQuery } from "@tanstack/react-query";
import { getObstacleProgress } from "../../../api/obstacleProgressApi";
import { queryKeys } from "../../../api/queryKeys";

export function useObstacleProgress() {
  return useQuery({
    queryKey: queryKeys.obstacleProgress,
    queryFn: getObstacleProgress,
  });
}
