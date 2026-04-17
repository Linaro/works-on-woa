import { Check, Plus, X } from "lucide-react";
import { addBulkReportSlug, removeBulkReportSlug, useBulkReport } from "@/lib/bulk-report";

interface RowReportActionProps {
  slug: string;
}

export function RowReportAction({ slug }: RowReportActionProps) {
  const bulkReport = useBulkReport();
  const inReport = bulkReport.hasSlug(slug);

  return (
    <button
      title={inReport ? "Remove from Report" : "Add to Report"}
      onClick={(e) => {
        e.stopPropagation();
        if (inReport) {
          removeBulkReportSlug(slug);
        } else {
          addBulkReportSlug(slug);
        }
      }}
      className="group inline-flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--color-text-primary)]"
    >
      {inReport ? (
        <>
          <Check className="h-4 w-4 group-hover:hidden" />
          <X className="hidden h-4 w-4 group-hover:block" />
        </>
      ) : (
        <Plus className="h-4 w-4" />
      )}
    </button>
  );
}
