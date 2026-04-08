import { useQuery } from "@tanstack/react-query";
import { getProvider } from "../provider";

export function usePopularProjects(locale = "en", limit = 10) {
  return useQuery({
    queryKey: ["popularProjects", locale, limit],
    queryFn: () => getProvider().getPopularProjects(locale, limit),
    staleTime: 10 * 60 * 1000,
  });
}
