import { useQuery } from "@tanstack/react-query";
import { getProvider } from "../provider";
import type { ProjectFilters } from "../types";

export function useProjects(
  filters?: ProjectFilters,
  page = 1,
  pageSize = 25
) {
  return useQuery({
    queryKey: ["projects", filters, page, pageSize],
    queryFn: () => getProvider().getProjects(filters, page, pageSize),
    staleTime: 5 * 60 * 1000,
  });
}
