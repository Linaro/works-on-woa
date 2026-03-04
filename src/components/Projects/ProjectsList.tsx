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
import type { ProjectFilters, ProjectType } from "@/data/types";

interface ProjectsListProps {
  type: ProjectType;
}

const PAGE_SIZE = 24;

export function ProjectsList({ type }: ProjectsListProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ProjectFilters>({
    type,
    search: initialSearch || undefined,
  });

  const { data: categoriesData } = useCategories(type);
  const { data: publishersData } = usePublishers(undefined, 1, 1000);
  const { data, isLoading } = useProjects(filters, page, PAGE_SIZE);

  useEffect(() => {
    const urlSearch = searchParams.get("search") ?? "";
    setFilters((prev) => {
      if ((prev.search ?? "") !== urlSearch) {
        return { ...prev, search: urlSearch || undefined };
      }
      return prev;
    });
  }, [searchParams]);

  const handleSearch = useCallback(
    (q: string) => {
      setFilters((prev) => ({ ...prev, search: q || undefined }));
      setPage(1);
      if (q) {
        setSearchParams({ search: q });
      } else {
        setSearchParams({});
      }
    },
    [setSearchParams]
  );

  const handleFilterChange = useCallback((key: string, values: string[]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: values.length > 0 ? values : undefined,
    }));
    setPage(1);
  }, []);

  const handleClearAll = useCallback(() => {
    setFilters({ type });
    setPage(1);
    setSearchParams({});
  }, [type, setSearchParams]);

  const typePublishers = (publishersData?.items ?? [])
    .filter((p) => type === "application" ? p.appCount > 0 : p.gameCount > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  const filterConfig = [
    {
      label: t("filters.category"),
      key: "category",
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
          defaultValue={initialSearch}
          onSearch={handleSearch}
          placeholder={t(type === "application" ? "hero.searchApps" : "hero.searchGames")}
          scope={type}
          compact
        />
      </div>

      <div className="mt-6">
        <FilterBar
          filters={filterConfig}
          activeFilters={{
            category: Array.isArray(filters.category) ? filters.category : filters.category ? [filters.category] : [],
            compatibility: Array.isArray(filters.compatibility) ? filters.compatibility : filters.compatibility ? [filters.compatibility] : [],
            emulationType: Array.isArray(filters.emulationType) ? filters.emulationType : filters.emulationType ? [filters.emulationType] : [],
            publisher: Array.isArray(filters.publisher) ? filters.publisher : filters.publisher ? [filters.publisher] : [],
            lastUpdated: Array.isArray(filters.lastUpdated) ? filters.lastUpdated : filters.lastUpdated ? [filters.lastUpdated] : [],
          }}
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
            sortable
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

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </Container>
  );
}
