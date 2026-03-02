import { useQuery } from "@tanstack/react-query";
import { getProvider } from "../provider";

export function useSearch(query: string, limit = 20) {
  return useQuery({
    queryKey: ["search", query, limit],
    queryFn: () => getProvider().searchProjects(query, limit),
    staleTime: 2 * 60 * 1000,
    enabled: query.length >= 2,
  });
}
