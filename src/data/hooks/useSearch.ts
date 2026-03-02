import { useQuery } from "@tanstack/react-query";
import { getProvider } from "../provider";
import type { ProjectType } from "../types";

export function useSearch(query: string, limit = 20, type?: ProjectType) {
  return useQuery({
    queryKey: ["search", query, limit, type],
    queryFn: () => getProvider().searchProjects(query, limit, type),
    staleTime: 2 * 60 * 1000,
    enabled: query.length >= 2,
  });
}
