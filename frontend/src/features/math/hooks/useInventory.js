import { useQuery } from "@tanstack/react-query";
import { getInventory } from "../../../api/inventoryApi";
import { queryKeys } from "../../../api/queryKeys";

export function useInventory() {
  return useQuery({
    queryKey: queryKeys.inventory,
    queryFn: getInventory,
  });
}
