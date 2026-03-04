import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowUpDown, Check, Copy, Trash2, X } from "lucide-react";
import { Container } from "@/components/Common/Container";
import { Button } from "@/components/Common/Button";
import { SearchBar } from "@/components/Common/SearchBar";
import { CompatibilityBadge, ValidationBadge } from "@/components/Common/Badge";
import { ProjectIcon } from "@/components/Common/ProjectIcon";
import { getProvider } from "@/data/provider";
import type { Project } from "@/data/types";
import { formatDate } from "@/utils/formatting";
import {
  DEFAULT_BULK_REPORT_TITLE,
  decodeBulkReportState,
  encodeBulkReportState,
  useBulkReport,
} from "@/lib/bulk-report";

type ReportView = "table" | "category" | "publisher";
type SortField = "name" | "compatibility" | "type" | "publisher" | "category" | "validation" | "lastUpdated";
type SortDirection = "asc" | "desc";

const SORTABLE_COLUMNS: Array<{ key: SortField; label: string }> = [
  { key: "name", label: "Name" },
  { key: "compatibility", label: "Compatible" },
  { key: "type", label: "Type" },
  { key: "publisher", label: "Developer" },
  { key: "category", label: "Category" },
  { key: "validation", label: "Validation" },
  { key: "lastUpdated", label: "Updated" },
];

function sortProjects(items: Project[], field: SortField, direction: SortDirection): Project[] {
  const sorted = [...items].sort((a, b) => {
    const getValue = (project: Project) => {
      switch (field) {
        case "name":
          return project.name.toLowerCase();
        case "compatibility":
          return project.compatibility;
        case "type":
          return project.emulationType;
        case "publisher":
          return (project.publisher || "").toLowerCase();
        case "category":
          return (project.categories[0] || "").toLowerCase();
        case "validation":
          return project.validation;
        case "lastUpdated":
          return project.lastUpdated;
      }
    };

    const av = getValue(a);
    const bv = getValue(b);

    if (field === "lastUpdated") {
      return new Date(av).getTime() - new Date(bv).getTime();
    }

    if (av < bv) return -1;
    if (av > bv) return 1;
    return 0;
  });

  return direction === "asc" ? sorted : sorted.reverse();
}

function renderSectionTable(
  title: string,
  items: Project[],
  onRemove: (slug: string) => void,
  onRowClick: (project: Project) => void,
  sortField: SortField,
  sortDirection: SortDirection,
  onSort: (field: SortField) => void
) {
  const sorted = sortProjects(items, sortField, sortDirection);

  return (
    <div className="mt-8">
      <h2 className="mb-3 text-xl font-semibold text-[var(--color-text-primary)]">{title}</h2>
      <div className="overflow-hidden rounded-[12px] border border-[rgba(255,255,255,0.06)] bg-[var(--color-bg-surface)]">
        <table className="w-full table-fixed text-left">
          <colgroup>
            <col className="w-[44px]" />
            <col className="w-[22%]" />
            <col className="w-[11%]" />
            <col className="w-[10%]" />
            <col className="w-[13%]" />
            <col className="w-[11%]" />
            <col className="w-[11%]" />
            <col className="w-[10%]" />
            <col className="w-[48px]" />
          </colgroup>
          <thead>
            <tr className="border-b border-[var(--color-border)] text-[13px] font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
              <th className="px-3 py-3 w-16"></th>
              {SORTABLE_COLUMNS.map((column) => (
                <th
                  key={column.key}
                  className={`py-3 ${
                    column.key === "compatibility"
                      ? "pl-4 pr-6"
                      : column.key === "type"
                        ? "pl-6 pr-4"
                        : "px-4"
                  }`}
                >
                  <button
                    onClick={() => onSort(column.key)}
                    className="inline-flex cursor-pointer items-center gap-1 text-[13px] uppercase tracking-wider"
                  >
                    {column.label}
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </th>
              ))}
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((project, i) => (
              <tr
                key={project.slug}
                onClick={() => onRowClick(project)}
                className={`cursor-pointer border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-bg-surface-hover)] ${i % 2 === 1 ? "bg-[rgba(255,255,255,0.02)]" : ""}`}
              >
                <td className="px-3 py-2">
                  <ProjectIcon icon={project.icon} name={project.name} size="sm" />
                </td>
                <td className="px-4 py-3 font-medium text-[var(--color-text-primary)]">{project.name}</td>
                <td className="pl-4 pr-6 py-3">
                  <CompatibilityBadge compatibility={project.compatibility} />
                </td>
                <td className="pl-6 pr-4 py-3 text-sm text-[var(--color-text-secondary)]">{project.emulationType}</td>
                <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">{project.publisher || "—"}</td>
                <td className="px-4 py-3 text-sm text-[var(--color-text-tertiary)]">{project.categories[0] || "—"}</td>
                <td className="px-4 py-3">
                  <ValidationBadge validation={project.validation} />
                </td>
                <td className="px-4 py-3 text-sm text-[var(--color-text-tertiary)]">
                  {formatDate(project.lastUpdated)}
                </td>
                <td className="px-4 py-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Remove from report"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(project.slug);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function BulkReportPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const bulkReport = useBulkReport();

  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);
  const [reportItems, setReportItems] = useState<Project[]>([]);
  const [view, setView] = useState<ReportView>("table");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [titleDraft, setTitleDraft] = useState(bulkReport.title || DEFAULT_BULK_REPORT_TITLE);

  useEffect(() => {
    const encoded = searchParams.get("data");
    if (!encoded) return;

    const decoded = decodeBulkReportState(encoded);
    if (!decoded) return;

    bulkReport.setState(decoded);
  }, [searchParams]);

  useEffect(() => {
    setTitleDraft(bulkReport.title || DEFAULT_BULK_REPORT_TITLE);
  }, [bulkReport.title]);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      const provider = getProvider();
      const allProjectsPage = await provider.getProjects(undefined, 1, 100000);

      if (cancelled) return;

      const all = allProjectsPage.items;
      const reportMap = new Map(all.map((item) => [item.slug, item]));
      const items = bulkReport.slugs.map((slug) => reportMap.get(slug)).filter(Boolean) as Project[];
      setReportItems(items);
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [bulkReport.slugs]);

  const groupedByCategory = useMemo(() => {
    const map = new Map<string, Project[]>();
    for (const item of reportItems) {
      const category = item.categories[0] || "Uncategorized";
      const existing = map.get(category) ?? [];
      existing.push(item);
      map.set(category, existing);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [reportItems]);

  const groupedByPublisher = useMemo(() => {
    const map = new Map<string, Project[]>();
    for (const item of reportItems) {
      const publisher = item.publisher || "Unknown Publisher";
      const existing = map.get(publisher) ?? [];
      existing.push(item);
      map.set(publisher, existing);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [reportItems]);

  const toggleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleShare = async () => {
    const encoded = encodeBulkReportState({
      title: bulkReport.title,
      slugs: bulkReport.slugs,
    });

    const next = new URLSearchParams(searchParams);
    next.set("data", encoded);
    setSearchParams(next, { replace: true });

    const shareUrl = `${window.location.origin}/bulk-report?data=${encodeURIComponent(encoded)}`;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRowClick = (project: Project) => {
    navigate(project.type === "application" ? `/apps/${project.slug}` : `/games/${project.slug}`);
  };

  return (
    <main id="main-content">
      <Container className="pt-28 pb-16">
        <div>
          <input
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={() => bulkReport.setTitle(titleDraft || DEFAULT_BULK_REPORT_TITLE)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-3 text-2xl font-bold text-[var(--color-text-primary)] outline-none md:text-3xl"
            placeholder={DEFAULT_BULK_REPORT_TITLE}
          />

          <p className="mt-2 text-sm text-[var(--color-text-tertiary)]">
          Add apps/games from this page, list pages, detail pages, or publisher pages.
        </p>

          <div className="mt-3 flex flex-row items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleShare}>
              {copied ? (
                <><Check className="mr-1 h-4 w-4" /> Copied!</>
              ) : (
                <><Copy className="mr-1 h-4 w-4" /> Share</>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={bulkReport.clear}>
              <Trash2 className="mr-1 h-4 w-4" /> Clear Report
            </Button>
          </div>
        </div>

        

        <div className="mt-6">
          <SearchBar
            compact
            scope={undefined}
            defaultValue={search}
            placeholder="Search apps and games"
            onSearch={(q) => setSearch(q)}
            onProjectSelect={(project) => bulkReport.addSlug(project.slug)}
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <Button
            variant={view === "table" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setView("table")}
          >
            All Items
          </Button>
          <Button
            variant={view === "category" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setView("category")}
          >
            By Category
          </Button>
          <Button
            variant={view === "publisher" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setView("publisher")}
          >
            By Publisher
          </Button>
        </div>

        {reportItems.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-[var(--color-border)] p-12 text-center">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">No items in your report yet</h2>
            <p className="mt-2 text-[var(--color-text-secondary)]">
              Add apps or games from the report page, from app/game tables, detail pages, or publisher pages.
            </p>
          </div>
        ) : view === "table" ? (
          renderSectionTable(
            "All Items",
            reportItems,
            bulkReport.removeSlug,
            handleRowClick,
            sortField,
            sortDirection,
            toggleSort
          )
        ) : view === "category" ? (
          <>
            {groupedByCategory.map(([category, items]) =>
              renderSectionTable(
                category,
                items,
                bulkReport.removeSlug,
                handleRowClick,
                sortField,
                sortDirection,
                toggleSort
              )
            )}
          </>
        ) : (
          <>
            {groupedByPublisher.map(([publisher, items]) =>
              renderSectionTable(
                publisher,
                items,
                bulkReport.removeSlug,
                handleRowClick,
                sortField,
                sortDirection,
                toggleSort
              )
            )}
          </>
        )}
      </Container>
    </main>
  );
}
