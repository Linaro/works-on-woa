import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check, Copy, Trash2 } from "lucide-react";
import { Container } from "@/components/Common/Container";
import { Button } from "@/components/Common/Button";
import { SearchBar } from "@/components/Common/SearchBar";
import { ProjectTable, type SortField, type SortDirection } from "@/components/Common/ProjectTable";
import { getProvider } from "@/data/provider";
import type { Project } from "@/data/types";
import {
  DEFAULT_BULK_REPORT_TITLE,
  decodeBulkReportState,
  encodeBulkReportState,
  useBulkReport,
} from "@/lib/bulk-report";

type ReportView = "table" | "category" | "publisher";

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
          <div className="mt-8">
            <ProjectTable
              items={reportItems}
              columns={["icon", "name", "compatibility", "type", "developer", "category", "validation", "updated"]}
              onRowClick={handleRowClick}
              sortable
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={toggleSort}
              actionMode="remove-only"
              onRemove={bulkReport.removeSlug}
              title="All Items"
            />
          </div>
        ) : view === "category" ? (
          <>
            {groupedByCategory.map(([category, items]) => (
              <div key={category} className="mt-8">
                <ProjectTable
                  items={items}
                  columns={["icon", "name", "compatibility", "type", "developer", "category", "validation", "updated"]}
                  onRowClick={handleRowClick}
                  sortable
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={toggleSort}
                  actionMode="remove-only"
                  onRemove={bulkReport.removeSlug}
                  title={category}
                />
              </div>
            ))}
          </>
        ) : (
          <>
            {groupedByPublisher.map(([publisher, items]) => (
              <div key={publisher} className="mt-8">
                <ProjectTable
                  items={items}
                  columns={["icon", "name", "compatibility", "type", "developer", "category", "validation", "updated"]}
                  onRowClick={handleRowClick}
                  sortable
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={toggleSort}
                  actionMode="remove-only"
                  onRemove={bulkReport.removeSlug}
                  title={publisher}
                />
              </div>
            ))}
          </>
        )}
      </Container>
    </main>
  );
}
