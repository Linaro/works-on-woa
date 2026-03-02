import { useQuery } from "@tanstack/react-query";
import { getProvider } from "../provider";

export function useProject(slug: string) {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: () => getProvider().getProject(slug),
    staleTime: 5 * 60 * 1000,
    enabled: !!slug,
  });
}
