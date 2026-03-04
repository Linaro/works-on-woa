import { useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { addBulkReportSlug, removeBulkReportSlug, useBulkReport } from "@/lib/bulk-report";

interface RowReportActionProps {
  slug: string;
}

export function RowReportAction({ slug }: RowReportActionProps) {
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
          <X className="h-4 w-4" />
        ) : (
          <Check className="h-4 w-4" />
        )
      ) : (
        <Plus className="h-4 w-4" />
      )}
    </button>
  );
}
