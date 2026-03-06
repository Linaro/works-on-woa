import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Project } from "@/data/types";
import { sortProjects, type SortField, type SortDirection } from "@/components/Common/ProjectTable";

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
    case "yes": return "Yes";
    case "no": return "No";
    default: return "Unknown";
  }
}

function emulationLabel(e: string): string {
  switch (e) {
    case "native": return "Native";
    case "emulation": return "Emulated";
    default: return "Unknown";
  }
}

function validationLabel(v: string): string {
  switch (v) {
    case "microsoft": return "Microsoft";
    case "qualcomm": return "Qualcomm";
    case "developer": return "Developer";
    case "community": return "Community";
    default: return "Unverified";
  }
}

const TABLE_COLUMNS = ["Name", "Compatibility", "Type", "Developer", "Category", "Validation", "Updated"];

function projectToRow(p: Project): string[] {
  return [
    p.name,
    compatibilityLabel(p.compatibility),
    emulationLabel(p.emulationType),
    p.publisher || "—",
    p.categories[0] || "—",
    validationLabel(p.validation),
    p.lastUpdated ? new Date(p.lastUpdated).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—",
  ];
}

function addTable(doc: jsPDF, items: Project[], sortField: SortField, sortDirection: SortDirection, startY: number): number {
  const sorted = sortProjects(items, sortField, sortDirection);
  const body = sorted.map(projectToRow);

  autoTable(doc, {
    startY,
    head: [TABLE_COLUMNS],
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
  doc.text("Arm device compatibility report of custom list of applications.", pageWidth / 2, 28, { align: "center" });

  // Date
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.setFontSize(10);
  doc.text(`Created on ${today}`, pageWidth / 2, 34, { align: "center" });

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
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 8, { align: "center" });
    doc.text("Generated by worksonwoa.com", pageWidth - 20, pageHeight - 8, { align: "right" });
  }

  // Sanitize filename
  const safeTitle = title.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_");
  doc.save(`${safeTitle}.pdf`);
}
