import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Check, Plus, X } from "lucide-react";
import { Container } from "@/components/Common/Container";
import { SearchBar } from "@/components/Common/SearchBar";
import { FilterBar } from "@/components/Common/FilterBar";
import { TableSkeleton } from "@/components/Common/Skeleton";
import { CompatibilityBadge, ValidationBadge } from "@/components/Common/Badge";
import { Button } from "@/components/Common/Button";
import { ProjectIcon } from "@/components/Common/ProjectIcon";
import { useProjects } from "@/data/hooks/useProjects";
import { useCategories } from "@/data/hooks/useCategories";
import { usePublishers } from "@/data/hooks/usePublishers";
import { formatDate } from "@/utils/formatting";
import { addBulkReportSlug, removeBulkReportSlug, useBulkReport } from "@/lib/bulk-report";
import type { ProjectFilters, ProjectType } from "@/data/types";

function RowReportAction({ slug }: { slug: string }) {
  const [hover, setHover] = useState(false);
  const bulkReport = useBulkReport();
  const inReport = bulkReport.hasSlug(slug);

  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={(e) => {
        e.stopPropagation();
        if (inReport) {
          removeBulkReportSlug(slug);
        } else {
          addBulkReportSlug(slug);
        }
      }}
      className="inline-flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--color-text-primary)]"
    >
      {inReport ? (
        hover ? (
          <><X className="h-4 w-4" /></>
        ) : (
          <><Check className="h-4 w-4" /></>
        )
      ) : (
        <Plus className="h-4 w-4" />
      )}
    </button>
  );
}

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

  // Sync filters when URL search params change (e.g. from dropdown "Show more")
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

  const emulationLabel = (emType: string) => {
    switch (emType) {
      case "native":
        return t("common.native");
      case "emulation":
        return t("common.emulation");
      default:
        return t("common.unknown");
    }
  };

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
      {/* Search */}
      <div className="mx-auto max-w-2xl">
        <SearchBar
          defaultValue={initialSearch}
          onSearch={handleSearch}
          placeholder={t(type === "application" ? "hero.searchApps" : "hero.searchGames")}
          scope={type}
          compact
        />
      </div>

      {/* Filters */}
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

      {/* Results info */}
      {data && (
        <p className="mt-6 text-center text-sm text-[var(--color-text-tertiary)]">
          {t("common.showingResults", {
            count: data.items.length,
            total: data.total,
          })}
        </p>
      )}

      {/* Table */}
      <div className="mt-6">
        {isLoading ? (
          <TableSkeleton rows={PAGE_SIZE} />
        ) : data && data.items.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-hidden rounded-[12px] border border-[rgba(255,255,255,0.06)] bg-[var(--color-bg-surface)] md:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-[13px] font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                    <th className="px-3 py-3 w-16"></th>
                    <th className="px-4 py-3">{t("popularApps.columns.name")}</th>
                    <th className="px-4 py-3">{t("popularApps.columns.compatibility")}</th>
                    <th className="px-4 py-3">{t("popularApps.columns.type")}</th>
                    <th className="px-4 py-3">{t("popularApps.columns.developer")}</th>
                    <th className="px-4 py-3">{t("popularApps.columns.category")}</th>
                    <th className="px-4 py-3">{t("popularApps.columns.validation")}</th>
                    <th className="px-4 py-3">{t("popularApps.columns.updated")}</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((project, i) => (
                    <tr
                      key={project.slug}
                      onClick={() => navigate(`${basePath}/${project.slug}`)}
                      className={`cursor-pointer border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-bg-surface-hover)] ${
                        i % 2 === 1 ? "bg-[rgba(255,255,255,0.02)]" : ""
                      }`}
                    >
                      <td className="px-3 py-2">
                        <ProjectIcon icon={project.icon} name={project.name} size="sm" />
                      </td>
                      <td className="px-4 py-3 font-medium text-[var(--color-text-primary)]">
                        {project.name}
                      </td>
                      <td className="px-4 py-3">
                        <CompatibilityBadge compatibility={project.compatibility} />
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                        {emulationLabel(project.emulationType)}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                        {project.publisher || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-text-tertiary)]">
                        {project.categories[0] || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <ValidationBadge validation={project.validation} />
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-text-tertiary)]">
                        {formatDate(project.lastUpdated)}
                      </td>
                      <td className="px-4 py-3">
                        <RowReportAction slug={project.slug} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="flex flex-col gap-3 md:hidden">
              {data.items.map((project) => (
                <div
                  key={project.slug}
                  onClick={() => navigate(`${basePath}/${project.slug}`)}
                  className="flex cursor-pointer items-center gap-3 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 transition-colors hover:bg-[var(--color-bg-surface-hover)]"
                >
                  <ProjectIcon icon={project.icon} name={project.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-[var(--color-text-primary)]">
                      {project.name}
                    </p>
                    <p className="text-sm text-[var(--color-text-tertiary)]">
                      {emulationLabel(project.emulationType)}
                    </p>
                  </div>
                  <RowReportAction slug={project.slug} />
                  <CompatibilityBadge compatibility={project.compatibility} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-[var(--color-text-secondary)]">
              {t("common.noResults")}
            </p>
            <Button
              variant="ghost"
              className="mt-4"
              onClick={handleClearAll}
            >
              {t("filters.clearAll")}
            </Button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <span>←</span> <span className="hidden md:inline">{t("common.previous")}</span>
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (page <= 4) {
                pageNum = i + 1;
              } else if (page >= totalPages - 3) {
                pageNum = totalPages - 6 + i;
              } else {
                pageNum = page - 3 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors ${
                    pageNum === page
                      ? "bg-[var(--color-accent)] text-white"
                      : "text-[var(--color-text-tertiary)] hover:bg-[rgba(255,255,255,0.06)]"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <Button
            variant="ghost"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <span className="hidden md:inline">{t("common.next")}</span> <span>→</span>
          </Button>
        </div>
      )}
    </Container>
  );
}
