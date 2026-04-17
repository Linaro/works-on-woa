import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check, Copy, Plus, X } from "lucide-react";
import { Container } from "@/components/Common/Container";
import { PublisherIcon } from "@/components/Common/PublisherIcon";

import { Button } from "@/components/Common/Button";
import { FilterBar } from "@/components/Common/FilterBar";
import { ProjectTable } from "@/components/Common/ProjectTable";
import { Pagination } from "@/components/Common/Pagination";
import { Skeleton, TableSkeleton } from "@/components/Common/Skeleton";
import { usePublisherBySlug } from "@/data/hooks/usePublishers";
import { useProjects } from "@/data/hooks/useProjects";
import { useCategories } from "@/data/hooks/useCategories";
import { getProvider } from "@/data/provider";
import { addBulkReportSlugs, removeBulkReportSlug, useBulkReport } from "@/lib/bulk-report";
import {
  filtersFromSearchParams,
  filtersToSearchParams,
  activeFiltersFromProjectFilters,
} from "@/utils/filter-params";
import type { ProjectFilters } from "@/data/types";

interface PublisherDetailViewProps {
  slug: string;
}

const PAGE_SIZE = 24;

export function PublisherDetailView({ slug }: PublisherDetailViewProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(() => {
    const p = parseInt(searchParams.get("page") ?? "1", 10);
    return isNaN(p) || p < 1 ? 1 : p;
  });
  const [isAddingAllApps, setIsAddingAllApps] = useState(false);
  const [reportHover, setReportHover] = useState(false);
  const [copied, setCopied] = useState(false);
  const bulkReport = useBulkReport();

  const { data: publisher, isLoading: pubLoading, error } = usePublisherBySlug(slug);

  // Filters — publisher is always locked to this publisher
  const [filters, setFilters] = useState<ProjectFilters>(() => ({
    publisher: [],
    ...filtersFromSearchParams(searchParams),
  }));

  // Categories for filter options (all types since publisher may have both)
  const { data: categoriesData } = useCategories();

  // Use the standard useProjects hook with publisher pre-set
  const publisherName = publisher?.name ?? "";
  const { data: projectsData, isLoading: projLoading } = useProjects(
    publisherName ? { ...filters, publisher: publisherName } : undefined,
    page,
    PAGE_SIZE
  );

  const isLoading = pubLoading;

  // Sync URL → filters
  useEffect(() => {
    const urlFilters = filtersFromSearchParams(searchParams);
    setFilters((prev) => ({ ...prev, ...urlFilters }));
    const p = parseInt(searchParams.get("page") ?? "1", 10);
    setPage(isNaN(p) || p < 1 ? 1 : p);

    if (!searchParams.has("page")) {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      setSearchParams(params, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Sync filters → URL
  const syncFiltersToUrl = useCallback(
    (nextFilters: ProjectFilters) => {
      // Exclude publisher from URL since it's implicit from the route
      const { publisher: _pub, ...urlFilters } = nextFilters;
      const params = filtersToSearchParams(urlFilters as ProjectFilters);
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

  const handleFilterChange = useCallback(
    (key: string, values: string[]) => {
      const next = { ...filters, [key]: values.length > 0 ? values : undefined };
      setFilters(next);
      setPage(1);
      syncFiltersToUrl(next);
    },
    [filters, syncFiltersToUrl]
  );

  const handleClearAll = useCallback(() => {
    const next: ProjectFilters = {};
    setFilters(next);
    setPage(1);
    setSearchParams({ page: "1" });
  }, [setSearchParams]);

  if (isLoading) {
    return (
      <Container className="py-16">
        <Skeleton className="mb-4 h-10 w-48" />
        <Skeleton className="mb-8 h-6 w-72" />
        <TableSkeleton rows={10} />
      </Container>
    );
  }

  if (error || !publisher) {
    return (
      <Container className="py-20 text-center">
        <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          {t("common.notFound")}
        </h2>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          {t("publishers.notFound")}
        </p>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => navigate("/publishers")}
        >
          ← {t("publishers.backToPublishers")}
        </Button>
      </Container>
    );
  }

  const totalPages = projectsData
    ? Math.ceil(projectsData.total / PAGE_SIZE)
    : 0;

  const handleAddAllApps = async () => {
    if (!publisher?.name) return;
    setIsAddingAllApps(true);
    try {
      const result = await getProvider().getProjectsByPublisher(
        publisher.name,
        1,
        100000
      );
      const allSlugs = result.items.map((item) => item.slug);
      addBulkReportSlugs(allSlugs);
    } finally {
      setIsAddingAllApps(false);
    }
  };

  const handleRemoveAllApps = async () => {
    if (!publisher?.name) return;
    setIsAddingAllApps(true);
    try {
      const result = await getProvider().getProjectsByPublisher(
        publisher.name,
        1,
        100000
      );
      for (const item of result.items) {
        removeBulkReportSlug(item.slug);
      }
    } finally {
      setIsAddingAllApps(false);
    }
  };

  const allPublisherSlugsInReport =
    projectsData && projectsData.items.length > 0
      ? projectsData.items.every((item) => bulkReport.hasSlug(item.slug))
      : false;

  return (
    <Container className="py-10 md:py-16">
      <div>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <PublisherIcon icon={publisher.icon} name={publisher.name} size="xl" />
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)] md:text-4xl">
                {publisher.name}
              </h1>
              <p className="mt-2 text-[var(--color-text-secondary)]">
                {t("publisherDetail.appCount", { count: publisher.appCount })} · {t("publisherDetail.gameCount", { count: publisher.gameCount })}
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={async () => {
                await navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? (
                <><Check className="mr-1 h-4 w-4" /> {t("common.copied")}</>
              ) : (
                <><Copy className="mr-1 h-4 w-4" /> {t("common.share")}</>
              )}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onMouseEnter={() => setReportHover(true)}
              onMouseLeave={() => setReportHover(false)}
              disabled={isAddingAllApps || (publisher.appCount === 0 && publisher.gameCount === 0)}
              onClick={() => {
                if (allPublisherSlugsInReport) {
                  handleRemoveAllApps();
                } else {
                  handleAddAllApps();
                }
              }}
            >
              {allPublisherSlugsInReport ? (
                reportHover ? (
                  <><X className="mr-1 h-4 w-4" /> {t("customReport.removeFromReport")}</>
                ) : (
                  <><Check className="mr-1 h-4 w-4" /> {t("customReport.inReport")}</>
                )
              ) : (
                <><Plus className="mr-1 h-4 w-4" /> {t("customReport.addAllPublisherApps")}</>
              )}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <FilterBar
            filters={[
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
                label: t("filters.lastUpdated"),
                key: "lastUpdated",
                options: [
                  { label: t("filters.last7Days"), value: "7d" },
                  { label: t("filters.last30Days"), value: "30d" },
                  { label: t("filters.last90Days"), value: "90d" },
                  { label: t("filters.lastYear"), value: "1y" },
                ],
              },
            ]}
            activeFilters={activeFiltersFromProjectFilters(filters)}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
          />
        </div>

        {/* Projects Table */}
        <div>
          {projLoading ? (
            <TableSkeleton rows={PAGE_SIZE} />
          ) : projectsData && projectsData.items.length > 0 ? (
            <ProjectTable
              items={projectsData.items}
              columns={["icon", "name", "compatibility", "type", "category", "validation", "updated"]}
              actionMode="add-remove"
            />
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg text-[var(--color-text-secondary)]">
                {t("common.noResults")}
              </p>
            </div>
          )}
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </Container>
  );
}
