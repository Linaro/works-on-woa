import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/Common/Container";
import { SearchBar } from "@/components/Common/SearchBar";
import { FilterBar } from "@/components/Common/FilterBar";
import { TableSkeleton } from "@/components/Common/Skeleton";
import { Button } from "@/components/Common/Button";
import { ProjectTable } from "@/components/Common/ProjectTable";
import { Pagination } from "@/components/Common/Pagination";
import { useProjects } from "@/data/hooks/useProjects";
import { useCategories } from "@/data/hooks/useCategories";
import { usePublishers } from "@/data/hooks/usePublishers";
import {
  filtersFromSearchParams,
  filtersToSearchParams,
  activeFiltersFromProjectFilters,
} from "@/utils/filter-params";
import type { ProjectFilters, ProjectType } from "@/data/types";
import { trackFilterUsage } from "@/lib/telemetry";

interface ProjectsListProps {
  type: ProjectType;
}

const PAGE_SIZE = 24;

export function ProjectsList({ type }: ProjectsListProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL
  const [page, setPage] = useState(() => {
    const p = parseInt(searchParams.get("page") ?? "1", 10);
    return isNaN(p) || p < 1 ? 1 : p;
  });
  const [filters, setFilters] = useState<ProjectFilters>(() => ({
    type,
    ...filtersFromSearchParams(searchParams),
  }));

  const { data: categoriesData } = useCategories(type);
  const { data: publishersData } = usePublishers(undefined, 1, 1000);
  const { data, isLoading } = useProjects(filters, page, PAGE_SIZE);

  // Sync URL → filters when search params change externally
  useEffect(() => {
    const urlFilters = filtersFromSearchParams(searchParams);
    setFilters((prev) => ({ ...prev, type, ...urlFilters }));
    const p = parseInt(searchParams.get("page") ?? "1", 10);
    setPage(isNaN(p) || p < 1 ? 1 : p);

    if (!searchParams.has("page")) {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      setSearchParams(params, { replace: true });
    }
  }, [searchParams, type, setSearchParams]);

  // Sync filters → URL whenever filters change
  const syncFiltersToUrl = useCallback(
    (nextFilters: ProjectFilters) => {
      const params = filtersToSearchParams(nextFilters);
      params.set("page", "1");
      setSearchParams(params, { replace: true });
    },
    [setSearchParams]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      const params = new URLSearchParams(searchParams);
      params.set("page", String(newPage));
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  const handleSearch = useCallback(
    (q: string) => {
      const next = { ...filters, search: q || undefined };
      setFilters(next);
      setPage(1);
      syncFiltersToUrl(next);
    },
    [filters, syncFiltersToUrl]
  );

  const handleFilterChange = useCallback(
    (key: string, values: string[]) => {
      trackFilterUsage(type === "application" ? "Apps" : "Games", key, values);
      const next = {
        ...filters,
        [key]: values.length > 0 ? values : undefined,
      };
      setFilters(next);
      setPage(1);
      syncFiltersToUrl(next);
    },
    [filters, syncFiltersToUrl, type]
  );

  const handleClearAll = useCallback(() => {
    const next: ProjectFilters = { type };
    setFilters(next);
    setPage(1);
    setSearchParams({ page: "1" });
  }, [type, setSearchParams]);

  const typePublishers = (publishersData?.items ?? [])
    .filter((p) => type === "application" ? p.appCount > 0 : p.gameCount > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  const filterConfig = [
    {
      label: t("filters.category"),
      key: "category",
      sortSelectedFirst: true,
      options: (categoriesData ?? []).map((c) => ({
        label: c.name,
        value: c.slug,
      })),
    },
    {
      label: t("filters.compatibility"),
      key: "compatibility",
      options: [
        { label: t("common.yes"), value: "yes" },
        { label: t("common.no"), value: "no" },
        { label: t("common.unknown"), value: "unknown" },
      ],
    },
    {
      label: t("filters.type"),
      key: "emulationType",
      options: [
        { label: t("common.native"), value: "native" },
        { label: t("common.emulation"), value: "emulation" },
      ],
    },
    {
      label: t("filters.publisher"),
      key: "publisher",
      sortSelectedFirst: true,
      options: typePublishers.map((p) => ({
        label: p.name,
        value: p.name,
      })),
    },
    {
      label: t("filters.lastUpdated"),
      key: "lastUpdated",
      options: [
        { label: t("filters.last7Days"), value: "7d" },
        { label: t("filters.last30Days"), value: "30d" },
        { label: t("filters.last90Days"), value: "90d" },
        { label: t("filters.lastYear"), value: "1y" },
      ],
    },
  ];

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;
  const basePath = type === "application" ? "/apps" : "/games";

  return (
    <Container className="pt-4 pb-10 md:pt-6 md:pb-16">
      <div className="mx-auto max-w-2xl">
        <SearchBar
          defaultValue={filters.search ?? ""}
          onSearch={handleSearch}
          placeholder={t(type === "application" ? "hero.searchApps" : "hero.searchGames")}
          scope={type}
          compact
        />
      </div>

      <div className="mt-6">
        <FilterBar
          filters={filterConfig}
          activeFilters={activeFiltersFromProjectFilters(filters)}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearAll}
          className="justify-center"
        />
      </div>

      {data && (
        <p className="mt-6 text-center text-sm text-[var(--color-text-tertiary)]">
          {t("common.showingResults", {
            count: data.items.length,
            total: data.total,
          })}
        </p>
      )}

      <div className="mt-6">
        {isLoading ? (
          <TableSkeleton rows={PAGE_SIZE} />
        ) : data && data.items.length > 0 ? (
          <ProjectTable
            items={data.items}
            columns={["icon", "name", "compatibility", "type", "developer", "category", "validation", "updated"]}
            onRowClick={(project) => navigate(`${basePath}/${project.slug}`)}
            actionMode="add-remove"
          />
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-[var(--color-text-secondary)]">
              {t("common.noResults")}
            </p>
            <Button variant="ghost" className="mt-4" onClick={handleClearAll}>
              {t("filters.clearAll")}
            </Button>
          </div>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </Container>
  );
}
