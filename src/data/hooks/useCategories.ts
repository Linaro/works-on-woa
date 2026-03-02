import { useQuery } from "@tanstack/react-query";
import { getProvider } from "../provider";
import type { ProjectType } from "../types";

export function useCategories(type?: ProjectType) {
  return useQuery({
    queryKey: ["categories", type],
    queryFn: () => getProvider().getCategories(type),
    staleTime: 10 * 60 * 1000,
  });
}
