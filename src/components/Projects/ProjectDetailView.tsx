import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { Check, Copy, Plus, X } from "lucide-react";
import { Container } from "@/components/Common/Container";

import { CompatibilityBadge, ValidationBadge } from "@/components/Common/Badge";
import { Button } from "@/components/Common/Button";
import { ProjectIcon } from "@/components/Common/ProjectIcon";
import { Skeleton } from "@/components/Common/Skeleton";
import { useProject } from "@/data/hooks/useProject";
import { formatDate, capitalize, formatCategory } from "@/utils/formatting";
import { addBulkReportSlug, removeBulkReportSlug, useBulkReport } from "@/lib/bulk-report";
import { trackButtonClick } from "@/lib/telemetry";
import type { ProjectType } from "@/data/types";

interface ProjectDetailViewProps {
  slug: string;
  type: ProjectType;
}

export function ProjectDetailView({ slug, type }: ProjectDetailViewProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useProject(slug);
  const bulkReport = useBulkReport();
  const [reportHover, setReportHover] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    trackButtonClick("Project Detail: share", { project: slug });
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <Container className="py-16">
        <Skeleton className="mb-4 h-10 w-48" />
        <Skeleton className="mb-2 h-6 w-72" />
        <Skeleton className="mb-8 h-4 w-40" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </Container>
    );
  }

  if (error || !project) {
    return (
      <Container className="py-20 text-center">
        <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          {t("common.notFound")}
        </h2>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          {t("appDetail.notFound")}
        </p>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => navigate(type === "application" ? "/apps" : "/games")}
        >
          ← {t("common.goBack")}
        </Button>
      </Container>
    );
  }

  const infoItems = [
    {
      label: t("appDetail.compatibility"),
      value: <CompatibilityBadge compatibility={project.compatibility} />,
    },
    ...(type !== "game" ? [{
      label: t("appDetail.emulationType"),
      value: t(`common.${project.emulationType}`) || capitalize(project.emulationType),
    }] : []),
    {
      label: t("appDetail.validation"),
      value: <ValidationBadge validation={project.validation} />,
    },
    {
      label: t("appDetail.publisher"),
      value: project.publisher || "—",
      link: project.publisher
        ? `/publishers/${project.publisher.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`
        : undefined,
    },
    {
      label: t("appDetail.categories"),
      value: project.categories.length > 0 && !(project.categories.length === 1 && project.categories[0] === "unknown")
        ? project.categories.map(formatCategory).join(", ")
        : "—",
    },
    {
      label: t("appDetail.lastUpdated"),
      value: formatDate(project.lastUpdated),
    },
  ];

  return (
    <Container className="py-10 md:py-16">
      <div>
        {/* Header */}
        <div className="flex items-start gap-5">
          <ProjectIcon icon={project.icon} name={project.name} size="xl" />
          <div className="min-w-0">
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] md:text-4xl">
              {project.name}
            </h1>
            {project.publisher && (
              <p className="mt-1 text-lg text-[var(--color-text-secondary)]">
                {project.publisher}
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {project.link && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => { trackButtonClick("Project Detail: get app", { project: project.slug }); window.open(project.link, "_blank", "noopener,noreferrer"); }}
                >
                  {t("appDetail.getThisApp")}
                </Button>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={handleShare}
              >
                {copied ? (
                  <><Check className="mr-1 h-4 w-4" /> {t("common.copied")}</>
                ) : (
                  <><Copy className="mr-1 h-4 w-4" /> {t("common.share")}</>
                )}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onMouseEnter={() => setReportHover(true)}
                onMouseLeave={() => setReportHover(false)}
                onClick={() => {
                  if (bulkReport.hasSlug(project.slug)) {
                    trackButtonClick("Project Detail: remove from report", { project: project.slug });
                    removeBulkReportSlug(project.slug);
                  } else {
                    trackButtonClick("Project Detail: add to report", { project: project.slug });
                    addBulkReportSlug(project.slug);
                  }
                }}
              >
                {bulkReport.hasSlug(project.slug) ? (
                  reportHover ? (
                    <><X className="mr-1 h-4 w-4" /> {t("customReport.removeFromReport")}</>
                  ) : (
                    <><Check className="mr-1 h-4 w-4" /> {t("customReport.inReport")}</>
                  )
                ) : (
                  <><Plus className="mr-1 h-4 w-4" /> {t("customReport.addToReport")}</>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {infoItems.map((item) => {
            const inner = (
              <>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  {item.label}
                </p>
                <div className="mt-2 text-[var(--color-text-primary)]">{item.value}</div>
              </>
            );

            return item.link ? (
              <Link
                key={item.label}
                to={item.link}
                className="cursor-pointer rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 transition-colors hover:border-[var(--color-accent-primary)]"
              >
                {inner}
              </Link>
            ) : (
              <div
                key={item.label}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4"
              >
                {inner}
              </div>
            );
          })}
        </div>

        {/* Compatibility Details */}
        {project.compatibilityDetails && project.compatibilityDetails.trim() !== "" && (
          <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
              {t("appDetail.compatibilityDetails")}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-[var(--color-text-primary)]">
              {project.compatibilityDetails}
            </p>
          </div>
        )}

        {/* Notes */}
        {project.notes && (
          <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
            <h3 className="text-sm font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
              {t("appDetail.notes")}
            </h3>
            <p className="mt-2 whitespace-pre-wrap text-[var(--color-text-secondary)] leading-relaxed">
              {project.notes}
            </p>
          </div>
        )}
      </div>
    </Container>
  );
}
