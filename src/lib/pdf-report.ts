import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import i18n from "i18next";
import type { Project } from "@/data/types";
import { sortProjects, type SortField, type SortDirection } from "@/components/Common/ProjectTable";
import { formatCategory } from "@/utils/formatting";

interface GenerateReportPdfOptions {
  title: string;
  items: Project[];
  view: "table" | "category" | "publisher";
  groupedByCategory?: [string, Project[]][];
  groupedByPublisher?: [string, Project[]][];
  sortField: SortField;
  sortDirection: SortDirection;
}

function compatibilityLabel(c: string): string {
  switch (c) {
    case "yes": return i18n.t("common.yes");
    case "no": return i18n.t("common.no");
    default: return i18n.t("common.unknown");
  }
}

function emulationLabel(e: string): string {
  switch (e) {
    case "native": return i18n.t("common.native");
    case "emulation": return i18n.t("common.emulation");
    default: return i18n.t("common.unknown");
  }
}

function validationLabel(v: string): string {
  switch (v) {
    case "microsoft": return i18n.t("validation.microsoft");
    case "qualcomm": return i18n.t("validation.qualcomm");
    case "developer": return i18n.t("validation.developer");
    case "community": return i18n.t("validation.community");
    default: return i18n.t("validation.unverified");
  }
}

function getTableColumns(): string[] {
  return [
    i18n.t("popularApps.columns.name"),
    i18n.t("popularApps.columns.compatibility"),
    i18n.t("popularApps.columns.type"),
    i18n.t("popularApps.columns.developer"),
    i18n.t("popularApps.columns.category"),
    i18n.t("popularApps.columns.validation"),
    i18n.t("popularApps.columns.updated"),
  ];
}

function projectToRow(p: Project): string[] {
  const locale = i18n.language || "en";
  return [
    p.name,
    compatibilityLabel(p.compatibility),
    emulationLabel(p.emulationType),
    p.publisher || "—",
    p.categories[0] && p.categories[0] !== "unknown" ? formatCategory(p.categories[0]) : "—",
    validationLabel(p.validation),
    p.lastUpdated ? new Date(p.lastUpdated).toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" }) : "—",
  ];
}

function addTable(doc: jsPDF, items: Project[], sortField: SortField, sortDirection: SortDirection, startY: number): number {
  const sorted = sortProjects(items, sortField, sortDirection);
  const body = sorted.map(projectToRow);

  autoTable(doc, {
    startY,
    head: [getTableColumns()],
    body,
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: [40, 40, 40],
      lineColor: [200, 200, 200],
      lineWidth: 0.25,
    },
    headStyles: {
      fillColor: [0, 120, 212],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    columnStyles: {
      0: { cellWidth: 50 },
    },
    margin: { left: 20, right: 20 },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (doc as any).lastAutoTable?.finalY ?? startY + 20;
}

export function generateReportPdf(options: GenerateReportPdfOptions) {
  const { title, items, view, groupedByCategory, groupedByPublisher, sortField, sortDirection } = options;

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(30, 30, 30);
  doc.text(title, pageWidth / 2, 20, { align: "center" });

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(i18n.t("customReport.reportSubtitle"), pageWidth / 2, 28, { align: "center" });

  // Date
  const locale = i18n.language || "en";
  const today = new Date().toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.setFontSize(10);
  doc.text(i18n.t("customReport.createdOn", { date: today }), pageWidth / 2, 34, { align: "center" });

  // Divider
  doc.setDrawColor(0, 120, 212);
  doc.setLineWidth(0.5);
  doc.line(20, 38, pageWidth - 20, 38);

  let currentY = 44;

  if (view === "table") {
    addTable(doc, items, sortField, sortDirection, currentY);
  } else if (view === "category" && groupedByCategory) {
    for (const [category, categoryItems] of groupedByCategory) {
      // Check if we need a new page
      if (currentY > doc.internal.pageSize.getHeight() - 30) {
        doc.addPage();
        currentY = 15;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(30, 30, 30);
      doc.text(category, 20, currentY);
      currentY += 4;

      currentY = addTable(doc, categoryItems, sortField, sortDirection, currentY);
      currentY += 8;
    }
  } else if (view === "publisher" && groupedByPublisher) {
    for (const [publisher, publisherItems] of groupedByPublisher) {
      if (currentY > doc.internal.pageSize.getHeight() - 30) {
        doc.addPage();
        currentY = 15;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(30, 30, 30);
      doc.text(publisher, 20, currentY);
      currentY += 4;

      currentY = addTable(doc, publisherItems, sortField, sortDirection, currentY);
      currentY += 8;
    }
  }

  // Footer on every page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(i18n.t("customReport.pageOf", { current: i, total: pageCount }), pageWidth / 2, pageHeight - 8, { align: "center" });
    doc.text(i18n.t("customReport.generatedBy"), pageWidth - 20, pageHeight - 8, { align: "right" });
  }

  // Sanitize filename
  const safeTitle = title.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_");
  doc.save(`${safeTitle}.pdf`);
}
