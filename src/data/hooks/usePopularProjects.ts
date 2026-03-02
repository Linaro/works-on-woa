import { useQuery } from "@tanstack/react-query";
import { getProvider } from "../provider";

export function usePopularProjects(limit = 10) {
  return useQuery({
    queryKey: ["popularProjects", limit],
    queryFn: () => getProvider().getPopularProjects(limit),
    staleTime: 10 * 60 * 1000,
  });
}
