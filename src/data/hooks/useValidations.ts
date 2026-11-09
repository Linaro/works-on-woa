import { useQuery } from "@tanstack/react-query";
import { getProvider } from "../provider";
import type { ProjectType } from "../types";

export function useValidations(type?: ProjectType) {
  return useQuery({
    queryKey: ["validations", type],
    queryFn: () => getProvider().getValidations(type),
    staleTime: 10 * 60 * 1000,
  });
}
