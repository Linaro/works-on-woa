import { type ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpDown, X } from "lucide-react";
import { CompatibilityBadge, ValidationBadge } from "@/components/Common/Badge";
import { Button } from "@/components/Common/Button";
import { ProjectIcon } from "@/components/Common/ProjectIcon";
import { RowReportAction } from "@/components/Common/RowReportAction";
import { formatDate, formatCategory } from "@/utils/formatting";
import type { Project } from "@/data/types";

// ---------------------------------------------------------------------------
// Column key type — determines which columns render
// ---------------------------------------------------------------------------
export type ProjectColumnKey =
  | "icon"
  | "name"
  | "compatibility"
  | "type"
  | "developer"
  | "category"
  | "validation"
  | "updated";

// Sorting
export type SortField =
  | "name"
  | "compatibility"
  | "type"
  | "publisher"
  | "category"
  | "validation"
  | "lastUpdated";

export type SortDirection = "asc" | "desc";

// Action mode
export type ActionMode = "add-remove" | "remove-only" | "none";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface ProjectTableProps {
  items: Project[];
  /** Which data columns to render (icon is always first if included). Default: all. */
  columns?: ProjectColumnKey[];
  /** Enable row click navigation to detail page. Default: true. */
  onRowClick?: (project: Project) => void;
  /** Sorting support */
  sortable?: boolean;
  sortField?: SortField;
  sortDirection?: SortDirection;
  onSort?: (field: SortField) => void;
  /** Action column mode. Default: "none". */
  actionMode?: ActionMode;
  /** Called when remove action is triggered (for remove-only mode). */
  onRemove?: (slug: string) => void;
  /** Icon size for the desktop table. Default: "sm". */
  iconSize?: "xs" | "sm";
  /** Optional section title rendered above the table. */
  title?: string;
  /** Optional node rendered below the table (e.g. "See All" button). */
  footer?: ReactNode;
}

// ---------------------------------------------------------------------------
// Default column set
// ---------------------------------------------------------------------------
const ALL_COLUMNS: ProjectColumnKey[] = [
  "icon",
  "name",
  "compatibility",
  "type",
  "developer",
  "category",
  "validation",
  "updated",
];

// Map column keys to i18n keys and sort fields
const COLUMN_META: Record<
  ProjectColumnKey,
  { i18nKey: string; sortField?: SortField }
> = {
  icon: { i18nKey: "" },
  name: { i18nKey: "popularApps.columns.name", sortField: "name" },
  compatibility: {
    i18nKey: "popularApps.columns.compatibility",
    sortField: "compatibility",
  },
  type: { i18nKey: "popularApps.columns.type", sortField: "type" },
  developer: {
    i18nKey: "popularApps.columns.developer",
    sortField: "publisher",
  },
  category: {
    i18nKey: "popularApps.columns.category",
    sortField: "category",
  },
  validation: {
    i18nKey: "popularApps.columns.validation",
    sortField: "validation",
  },
  updated: {
    i18nKey: "popularApps.columns.updated",
    sortField: "lastUpdated",
  },
};

// ---------------------------------------------------------------------------
// Sort helper (client-side)
// ---------------------------------------------------------------------------
export function sortProjects(
  items: Project[],
  field: SortField,
  direction: SortDirection
): Project[] {
  const sorted = [...items].sort((a, b) => {
    const getValue = (p: Project) => {
      switch (field) {
        case "name":
          return p.name.toLowerCase();
        case "compatibility":
          return p.compatibility;
        case "type":
          return p.emulationType;
        case "publisher":
          return (p.publisher || "").toLowerCase();
        case "category":
          return (p.categories[0] || "").toLowerCase();
        case "validation":
          return p.validation;
        case "lastUpdated":
          return p.lastUpdated;
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

// ---------------------------------------------------------------------------
// Emulation label helper
// ---------------------------------------------------------------------------
function useEmulationLabel() {
  const { t } = useTranslation();
  return (emType: string) => {
    switch (emType) {
      case "native":
        return t("common.native");
      case "emulation":
        return t("common.emulation");
      default:
        return t("common.unknown");
    }
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ProjectTable({
  items,
  columns = ALL_COLUMNS,
  onRowClick,
  sortable = false,
  sortField: extSortField,
  sortDirection: extSortDirection,
  onSort: extOnSort,
  actionMode = "none",
  onRemove,
  iconSize = "sm",
  title,
  footer,
}: ProjectTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const emulationLabel = useEmulationLabel();

  // Internal sort state (used when sortable but no external state provided)
  const [intSortField, setIntSortField] = useState<SortField>("name");
  const [intSortDirection, setIntSortDirection] = useState<SortDirection>("asc");

  const currentSortField = extSortField ?? intSortField;
  const currentSortDirection = extSortDirection ?? intSortDirection;

  const handleSort = (field: SortField) => {
    if (extOnSort) {
      extOnSort(field);
    } else {
      if (field === intSortField) {
        setIntSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setIntSortField(field);
        setIntSortDirection("asc");
      }
    }
  };

  const displayItems = sortable
    ? sortProjects(items, currentSortField, currentSortDirection)
    : items;

  const handleRowClick = (project: Project) => {
    if (onRowClick) {
      onRowClick(project);
    } else {
      const basePath =
        project.type === "application" ? "/apps" : "/games";
      navigate(`${basePath}/${project.slug}`);
    }
  };

  const hasActions = actionMode !== "none";

  // Render cell content for a given column key
  const renderCell = (col: ProjectColumnKey, project: Project) => {
    switch (col) {
      case "icon":
        return (
          <ProjectIcon
            icon={project.icon}
            name={project.name}
            size={iconSize}
          />
        );
      case "name":
        return project.name;
      case "compatibility":
        return <CompatibilityBadge compatibility={project.compatibility} />;
      case "type":
        return emulationLabel(project.emulationType);
      case "developer":
        return project.publisher || "—";
      case "category":
        return project.categories[0] && project.categories[0] !== "unknown" ? formatCategory(project.categories[0]) : "—";
      case "validation":
        return <ValidationBadge validation={project.validation} />;
      case "updated":
        return formatDate(project.lastUpdated);
    }
  };

  // Cell class for a given column
  const cellClass = (col: ProjectColumnKey) => {
    switch (col) {
      case "icon":
        return "px-3 py-2";
      case "name":
        return "px-4 py-3 font-medium text-[var(--color-text-primary)]";
      case "compatibility":
      case "validation":
        return "px-4 py-3";
      case "type":
      case "developer":
        return "px-4 py-3 text-sm text-[var(--color-text-secondary)]";
      case "category":
      case "updated":
        return "px-4 py-3 text-sm text-[var(--color-text-tertiary)]";
      default:
        return "px-4 py-3";
    }
  };

  // Header class for a given column
  const headerClass = (col: ProjectColumnKey) => {
    if (col === "icon") return "px-3 py-3 w-14";
    return "px-4 py-3";
  };

  return (
    <div>
      {title && (
        <h2 className="mb-3 text-xl font-semibold text-[var(--color-text-primary)]">
          {title}
        </h2>
      )}

      {/* Desktop / Tablet Table — horizontal scroll on overflow */}
      <div className="hidden overflow-x-auto rounded-[12px] border border-[rgba(255,255,255,0.06)] bg-[var(--color-bg-surface)] md:block">
        <table className="w-full min-w-[800px] text-left">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-[13px] font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
              {columns.map((col) => (
                <th key={col} className={headerClass(col)}>
                  {col !== "icon" && COLUMN_META[col].i18nKey ? (
                    sortable && COLUMN_META[col].sortField ? (
                      <button
                        onClick={() =>
                          handleSort(COLUMN_META[col].sortField!)
                        }
                        className="inline-flex cursor-pointer items-center gap-1 text-[13px] uppercase tracking-wider"
                      >
                        {t(COLUMN_META[col].i18nKey)}
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      t(COLUMN_META[col].i18nKey)
                    )
                  ) : null}
                </th>
              ))}
              {hasActions && <th className="px-4 py-3"></th>}
            </tr>
          </thead>
          <tbody>
            {displayItems.map((project, i) => (
              <tr
                key={project.slug}
                onClick={() => handleRowClick(project)}
                className={`cursor-pointer border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-bg-surface-hover)] ${
                  i % 2 === 1 ? "bg-[rgba(255,255,255,0.02)]" : ""
                }`}
              >
                {columns.map((col) => (
                  <td key={col} className={cellClass(col)}>
                    {renderCell(col, project)}
                  </td>
                ))}
                {hasActions && (
                  <td className="px-4 py-3">
                    {actionMode === "add-remove" ? (
                      <RowReportAction slug={project.slug} />
                    ) : actionMode === "remove-only" && onRemove ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Remove from Report"
                        aria-label="Remove from report"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(project.slug);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="flex flex-col gap-3 md:hidden">
        {displayItems.map((project) => (
          <div
            key={project.slug}
            onClick={() => handleRowClick(project)}
            className="flex cursor-pointer items-center gap-3 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 transition-colors hover:bg-[var(--color-bg-surface-hover)]"
          >
            <ProjectIcon
              icon={project.icon}
              name={project.name}
              size="sm"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-[var(--color-text-primary)]">
                {project.name}
              </p>
              <p className="text-sm text-[var(--color-text-tertiary)]">
                {emulationLabel(project.emulationType)}
              </p>
            </div>
            {actionMode === "add-remove" && (
              <RowReportAction slug={project.slug} />
            )}
            {actionMode === "remove-only" && onRemove && (
              <Button
                variant="ghost"
                size="sm"
                title="Remove from Report"
                aria-label="Remove from report"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(project.slug);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <CompatibilityBadge compatibility={project.compatibility} />
          </div>
        ))}
      </div>

      {footer}
    </div>
  );
}
