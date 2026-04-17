import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Check, Copy, Download, Trash2 } from "lucide-react";
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
import { generateReportPdf } from "@/lib/pdf-report";
import { generateReportXlsx } from "@/lib/xlsx-report";
import { trackButtonClick, trackReportAction } from "@/lib/telemetry";
import { usePageTitle } from "@/hooks/usePageTitle";
import { formatCategory } from "@/utils/formatting";

type ReportView = "table" | "category" | "publisher";

export default function BulkReportPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const bulkReport = useBulkReport();
  usePageTitle("Custom Report");

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
      const raw = item.categories[0];
      const category = raw ? formatCategory(raw) : t("customReport.uncategorized");
      const existing = map.get(category) ?? [];
      existing.push(item);
      map.set(category, existing);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [reportItems]);

  const groupedByPublisher = useMemo(() => {
    const map = new Map<string, Project[]>();
    for (const item of reportItems) {
      const publisher = item.publisher || t("customReport.unknownPublisher");
      const existing = map.get(publisher) ?? [];
      existing.push(item);
      map.set(publisher, existing);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [reportItems]);

  const _toggleSort = (field: SortField) => {
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

    const shareUrl = `${window.location.origin}/custom-report?data=${encodeURIComponent(encoded)}`;
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

          <p className="mt-2 text-center text-sm text-[var(--color-text-tertiary)]">
          {t("customReport.subtitle")}
        </p>

          <div className="mt-3 flex flex-row items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => { trackButtonClick("Custom Report: share"); trackReportAction("share", bulkReport.title || DEFAULT_BULK_REPORT_TITLE, bulkReport.slugs); handleShare(); }}>
              {copied ? (
                <><Check className="mr-1 h-4 w-4" /> {t("customReport.copied")}</>
              ) : (
                <><Copy className="mr-1 h-4 w-4" /> {t("customReport.share")}</>
              )}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={reportItems.length === 0}
              onClick={() => {
                trackButtonClick("Custom Report: download pdf");
                trackReportAction("download pdf", bulkReport.title || DEFAULT_BULK_REPORT_TITLE, bulkReport.slugs);
                generateReportPdf({
                  title: bulkReport.title || DEFAULT_BULK_REPORT_TITLE,
                  items: reportItems,
                  view,
                  groupedByCategory,
                  groupedByPublisher,
                  sortField,
                  sortDirection,
                });
              }}
            >
              <Download className="mr-1 h-4 w-4" /> {t("customReport.downloadPdf")}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={reportItems.length === 0}
              onClick={() => {
                trackButtonClick("Custom Report: download excel");
                trackReportAction("download excel", bulkReport.title || DEFAULT_BULK_REPORT_TITLE, bulkReport.slugs);
                generateReportXlsx({
                  title: bulkReport.title || DEFAULT_BULK_REPORT_TITLE,
                  items: reportItems,
                  view,
                  groupedByCategory,
                  groupedByPublisher,
                  sortField,
                  sortDirection,
                });
              }}
            >
              <Download className="mr-1 h-4 w-4" /> {t("customReport.downloadXlsx")}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { trackButtonClick("Custom Report: clear report"); bulkReport.clear(); }}>
              <Trash2 className="mr-1 h-4 w-4" /> {t("customReport.clearReport")}
            </Button>
          </div>
        </div>

        

        <div className="mt-6">
          <SearchBar
            compact
            scope={undefined}
            defaultValue={search}
            placeholder={t("customReport.searchPlaceholder")}
            onSearch={(q) => setSearch(q)}
            onProjectSelect={(project) => bulkReport.addSlug(project.slug)}
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <Button
            variant={view === "table" ? "primary" : "ghost"}
            size="sm"
            onClick={() => { trackButtonClick("Custom Report: all items"); setView("table"); }}
          >
            {t("customReport.viewAll")}
          </Button>
          <Button
            variant={view === "category" ? "primary" : "ghost"}
            size="sm"
            onClick={() => { trackButtonClick("Custom Report: by category"); setView("category"); }}
          >
            {t("customReport.viewByCategory")}
          </Button>
          <Button
            variant={view === "publisher" ? "primary" : "ghost"}
            size="sm"
            onClick={() => { trackButtonClick("Custom Report: by publisher"); setView("publisher"); }}
          >
            {t("customReport.viewByPublisher")}
          </Button>
        </div>

        {reportItems.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-[var(--color-border)] p-12 text-center">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">{t("customReport.emptyTitle")}</h2>
            <p className="mt-2 text-[var(--color-text-secondary)]">
              {t("customReport.emptyDescription")}
            </p>
          </div>
        ) : view === "table" ? (
          <div className="mt-8">
            <ProjectTable
              items={reportItems}
              columns={["icon", "name", "compatibility", "type", "developer", "category", "validation", "updated"]}
              onRowClick={handleRowClick}
              actionMode="remove-only"
              onRemove={bulkReport.removeSlug}
              title={t("customReport.viewAll")}
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
