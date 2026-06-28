import { useQuery } from "@tanstack/react-query";
import { getChild } from "../../api/childApi";

export function useChild() {
  return useQuery({
    queryKey: ["child"],
    queryFn: getChild,
  });
}