import { useState, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/Common/Container";
import { SearchBar } from "@/components/Common/SearchBar";
import { TableSkeleton } from "@/components/Common/Skeleton";
import { Button } from "@/components/Common/Button";
import { usePublishers } from "@/data/hooks/usePublishers";

const PAGE_SIZE = 24;

export function PublishersList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string | undefined>(initialSearch || undefined);

  const { data, isLoading } = usePublishers(search, page, PAGE_SIZE);

  // Sync when URL search params change (e.g. from dropdown "Show more")
  useEffect(() => {
    const urlSearch = searchParams.get("search") ?? "";
    setSearch(urlSearch || undefined);
  }, [searchParams]);

  const handleSearch = useCallback((q: string) => {
    setSearch(q || undefined);
    setPage(1);
    if (q) {
      setSearchParams({ search: q });
    } else {
      setSearchParams({});
    }
  }, [setSearchParams]);

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  return (
    <Container className="pt-4 pb-10 md:pt-6 md:pb-16">
      {/* Search */}
      <div className="mx-auto max-w-2xl">
        <SearchBar onSearch={handleSearch} defaultValue={initialSearch} placeholder={t("hero.searchPublishers")} scope="publisher" compact />
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
                    <th className="px-4 py-3">{t("publishers.columns.name")}</th>
                    <th className="px-4 py-3">{t("publishers.columns.apps")}</th>
                    <th className="px-4 py-3">{t("publishers.columns.games")}</th>
                    <th className="px-4 py-3">{t("publishers.columns.total")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((publisher, i) => (
                    <tr
                      key={publisher.slug}
                      onClick={() => navigate(`/publishers/${publisher.slug}`)}
                      className={`cursor-pointer border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-bg-surface-hover)] ${
                        i % 2 === 1 ? "bg-[rgba(255,255,255,0.02)]" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-[var(--color-text-primary)]">
                        {publisher.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                        {publisher.appCount}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                        {publisher.gameCount}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                        {publisher.totalCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="flex flex-col gap-3 md:hidden">
              {data.items.map((publisher) => (
                <div
                  key={publisher.slug}
                  onClick={() => navigate(`/publishers/${publisher.slug}`)}
                  className="flex cursor-pointer items-center justify-between rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 transition-colors hover:bg-[var(--color-bg-surface-hover)]"
                >
                  <p className="font-medium text-[var(--color-text-primary)]">
                    {publisher.name}
                  </p>
                  <p className="text-sm text-[var(--color-text-tertiary)]">
                    {publisher.totalCount} {publisher.totalCount === 1 ? "title" : "titles"}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-[var(--color-text-secondary)]">
              {t("common.noResults")}
            </p>
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
                  className={`cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors ${
                    pageNum === page
                      ? "bg-[var(--color-accent-primary)] text-white"
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
