/**
 * Helpers for syncing ProjectFilters with URL search params.
 * Filter keys stored as comma-separated values: ?category=productivity,games&compatibility=yes
 */

import type { ProjectFilters } from "@/data/types";

/** Filter keys that should be synced to the URL. */
const FILTER_KEYS = [
  "category",
  "compatibility",
  "emulationType",
  "publisher",
  "lastUpdated",
] as const;

/**
 * Read filter values from URLSearchParams into a partial ProjectFilters object.
 * Also reads "search" param.
 */
export function filtersFromSearchParams(
  params: URLSearchParams
): Partial<ProjectFilters> {
  const result: Partial<ProjectFilters> = {};

  const search = params.get("search");
  if (search) {
    result.search = search;
  }

  for (const key of FILTER_KEYS) {
    const raw = params.get(key);
    if (raw) {
      const values = raw.split(",").filter(Boolean);
      if (values.length > 0) {
        (result as Record<string, unknown>)[key] = values;
      }
    }
  }

  return result;
}

/**
 * Write current filters into URLSearchParams, replacing existing filter keys.
 * Returns a new URLSearchParams object (does not mutate the input).
 */
export function filtersToSearchParams(
  filters: ProjectFilters,
  existing?: URLSearchParams
): URLSearchParams {
  const params = new URLSearchParams(existing?.toString() ?? "");

  // Search
  if (filters.search) {
    params.set("search", filters.search);
  } else {
    params.delete("search");
  }

  // Multi-value filters
  for (const key of FILTER_KEYS) {
    const value = (filters as Record<string, unknown>)[key];
    if (Array.isArray(value) && value.length > 0) {
      params.set(key, value.join(","));
    } else if (typeof value === "string" && value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
  }

  return params;
}

/**
 * Build the activeFilters record for FilterBar from a ProjectFilters object.
 */
export function activeFiltersFromProjectFilters(
  filters: ProjectFilters
): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const key of FILTER_KEYS) {
    const value = (filters as Record<string, unknown>)[key];
    if (Array.isArray(value)) {
      result[key] = value;
    } else if (typeof value === "string" && value) {
      result[key] = [value];
    } else {
      result[key] = [];
    }
  }
  return result;
}
