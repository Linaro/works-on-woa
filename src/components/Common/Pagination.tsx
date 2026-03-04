import { useTranslation } from "react-i18next";
import { Button } from "@/components/Common/Button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(Math.max(1, page - 1))}
      >
        <span>←</span>{" "}
        <span className="hidden md:inline">{t("common.previous")}</span>
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
              onClick={() => onPageChange(pageNum)}
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
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
      >
        <span className="hidden md:inline">{t("common.next")}</span>{" "}
        <span>→</span>
      </Button>
    </div>
  );
}
