import * as XLSX from "xlsx";
import type { Project } from "@/data/types";
import { sortProjects, type SortField, type SortDirection } from "@/components/Common/ProjectTable";
import { formatCategory } from "@/utils/formatting";

interface GenerateReportXlsxOptions {
  title: string;
  items: Project[];
  view: "table" | "category" | "publisher";
  groupedByCategory?: [string, Project[]][];
  groupedByPublisher?: [string, Project[]][];
  sortField: SortField;
  sortDirection: SortDirection;
}

const COLUMNS = ["Name", "Compatibility", "Type", "Publisher", "Category", "Validation", "Updated"];

function compatibilityLabel(c: string): string {
  switch (c) {
    case "yes": return "Yes";
    case "no": return "No";
    default: return "-";
  }
}

function emulationLabel(e: string): string {
  switch (e) {
    case "native": return "Native";
    case "emulation": return "Emulated";
    default: return "-";
  }
}

function validationLabel(v: string): string {
  switch (v) {
    case "microsoft": return "Microsoft";
    case "qualcomm": return "Qualcomm";
    case "developer": return "Publisher";
    case "community": return "Community";
    default: return "Unverified";
  }
}

function projectToRow(p: Project): string[] {
  return [
    p.name,
    compatibilityLabel(p.compatibility),
    emulationLabel(p.emulationType),
    p.publisher || "-",
    p.categories[0] && p.categories[0] !== "unknown" ? formatCategory(p.categories[0]) : "-",
    validationLabel(p.validation),
    p.lastUpdated
      ? new Date(p.lastUpdated).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
      : "-",
  ];
}

function buildSheet(items: Project[], sortField: SortField, sortDirection: SortDirection): XLSX.WorkSheet {
  const sorted = sortProjects(items, sortField, sortDirection);
  const data = [COLUMNS, ...sorted.map(projectToRow)];
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  ws["!cols"] = [
    { wch: 40 }, // Name
    { wch: 14 }, // Compatibility
    { wch: 12 }, // Type
    { wch: 25 }, // Publisher
    { wch: 20 }, // Category
    { wch: 14 }, // Validation
    { wch: 14 }, // Updated
  ];

  return ws;
}

export function generateReportXlsx(options: GenerateReportXlsxOptions) {
  const { title, items, view, groupedByCategory, groupedByPublisher, sortField, sortDirection } = options;

  const wb = XLSX.utils.book_new();

  if (view === "table") {
    const ws = buildSheet(items, sortField, sortDirection);
    XLSX.utils.book_append_sheet(wb, ws, "All Apps");
  } else if (view === "category" && groupedByCategory) {
    const allWs = buildSheet(items, sortField, sortDirection);
    XLSX.utils.book_append_sheet(wb, allWs, "All Apps");
    for (const [category, categoryItems] of groupedByCategory) {
      const sheetName = category.slice(0, 31);
      const ws = buildSheet(categoryItems, sortField, sortDirection);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    }
  } else if (view === "publisher" && groupedByPublisher) {
    const allWs = buildSheet(items, sortField, sortDirection);
    XLSX.utils.book_append_sheet(wb, allWs, "All Apps");
    for (const [publisher, publisherItems] of groupedByPublisher) {
      const sheetName = publisher.slice(0, 31);
      const ws = buildSheet(publisherItems, sortField, sortDirection);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    }
  }

  const safeTitle = title.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_");
  XLSX.writeFile(wb, `${safeTitle}.xlsx`);
}
