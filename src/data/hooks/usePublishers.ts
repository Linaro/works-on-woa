import { useQuery } from "@tanstack/react-query";
import { getProvider } from "../provider";

export function usePublishers(search?: string, page = 1, pageSize = 25) {
  return useQuery({
    queryKey: ["publishers", search, page, pageSize],
    queryFn: () => getProvider().getPublishers(search, page, pageSize),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePublisherBySlug(slug: string) {
  return useQuery({
    queryKey: ["publisher", slug],
    queryFn: () => getProvider().getPublisherBySlug(slug),
    staleTime: 5 * 60 * 1000,
    enabled: !!slug,
  });
}

export function useProjectsByPublisher(
  publisherName: string,
  page = 1,
  pageSize = 25
) {
  return useQuery({
    queryKey: ["publisherProjects", publisherName, page, pageSize],
    queryFn: () =>
      getProvider().getProjectsByPublisher(publisherName, page, pageSize),
    staleTime: 5 * 60 * 1000,
    enabled: !!publisherName,
  });
}
