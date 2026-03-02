import { useQuery } from "@tanstack/react-query";
import { getProvider } from "../provider";

export function useMicrosoftApps() {
  return useQuery({
    queryKey: ["microsoftApps"],
    queryFn: () => getProvider().getMicrosoftApps(),
    staleTime: 10 * 60 * 1000,
  });
}
