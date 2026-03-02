import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/Common/Container";
import { BackButton } from "@/components/Common/BackButton";
import { CompatibilityBadge, ValidationBadge } from "@/components/Common/Badge";
import { Button } from "@/components/Common/Button";
import { Skeleton, TableSkeleton } from "@/components/Common/Skeleton";
import { usePublisherBySlug, useProjectsByPublisher } from "@/data/hooks/usePublishers";
import { formatDate, capitalize } from "@/utils/formatting";

interface PublisherDetailViewProps {
  slug: string;
}

const PAGE_SIZE = 24;

export function PublisherDetailView({ slug }: PublisherDetailViewProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data: publisher, isLoading: pubLoading, error } = usePublisherBySlug(slug);
  const { data: projectsData, isLoading: projLoading } = useProjectsByPublisher(
    publisher?.name ?? "",
    page,
    PAGE_SIZE
  );

  const isLoading = pubLoading;

  if (isLoading) {
    return (
      <Container className="py-16">
        <Skeleton className="mb-4 h-10 w-48" />
        <Skeleton className="mb-8 h-6 w-72" />
        <TableSkeleton rows={10} />
      </Container>
    );
  }

  if (error || !publisher) {
    return (
      <Container className="py-20 text-center">
        <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          {t("common.notFound")}
        </h2>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          {t("publishers.notFound")}
        </p>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => navigate("/publishers")}
        >
          ← {t("publishers.backToPublishers")}
        </Button>
      </Container>
    );
  }

  const totalPages = projectsData
    ? Math.ceil(projectsData.total / PAGE_SIZE)
    : 0;

  const emulationLabel = (emType: string) => {
    switch (emType) {
      case "native":
        return t("common.native");
      case "emulation":
        return t("common.emulation");
      default:
        return t("common.unknown");
    }
  };

  return (
    <Container className="py-10 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Back button */}
        <BackButton to="/publishers">
          {t("publishers.backToPublishers")}
        </BackButton>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] md:text-4xl">
            {publisher.name}
          </h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            {publisher.appCount} {publisher.appCount === 1 ? "app" : "apps"} · {publisher.gameCount}{" "}
            {publisher.gameCount === 1 ? "game" : "games"}
          </p>
        </div>

        {/* Projects Table */}
        <div>
          {projLoading ? (
            <TableSkeleton rows={PAGE_SIZE} />
          ) : projectsData && projectsData.items.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-hidden rounded-[12px] border border-[rgba(255,255,255,0.06)] bg-[var(--color-bg-surface)] md:block">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] text-[13px] font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                      <th className="px-4 py-3 w-12"></th>
                      <th className="px-4 py-3">{t("popularApps.columns.name")}</th>
                      <th className="px-4 py-3">{t("popularApps.columns.compatibility")}</th>
                      <th className="px-4 py-3">{t("popularApps.columns.type")}</th>
                      <th className="px-4 py-3">{t("popularApps.columns.category")}</th>
                      <th className="px-4 py-3">{t("popularApps.columns.validation")}</th>
                      <th className="px-4 py-3">{t("popularApps.columns.updated")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectsData.items.map((project, i) => {
                      const basePath =
                        project.type === "application" ? "/apps" : "/games";
                      return (
                        <tr
                          key={project.slug}
                          onClick={() => navigate(`${basePath}/${project.slug}`)}
                          className={`cursor-pointer border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-bg-surface-hover)] ${
                            i % 2 === 1 ? "bg-[rgba(255,255,255,0.02)]" : ""
                          }`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.06)] text-xs text-[var(--color-text-tertiary)]">
                              {project.name.charAt(0)}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium text-[var(--color-text-primary)]">
                            {project.name}
                          </td>
                          <td className="px-4 py-3">
                            <CompatibilityBadge compatibility={project.compatibility} />
                          </td>
                          <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                            {emulationLabel(project.emulationType)}
                          </td>
                          <td className="px-4 py-3 text-sm text-[var(--color-text-tertiary)]">
                            {project.categories[0] || "—"}
                          </td>
                          <td className="px-4 py-3">
                            <ValidationBadge validation={project.validation} />
                          </td>
                          <td className="px-4 py-3 text-sm text-[var(--color-text-tertiary)]">
                            {formatDate(project.lastUpdated)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List */}
              <div className="flex flex-col gap-3 md:hidden">
                {projectsData.items.map((project) => {
                  const basePath =
                    project.type === "application" ? "/apps" : "/games";
                  return (
                    <div
                      key={project.slug}
                      onClick={() => navigate(`${basePath}/${project.slug}`)}
                      className="flex cursor-pointer items-center gap-3 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 transition-colors hover:bg-[var(--color-bg-surface-hover)]"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.06)] text-sm text-[var(--color-text-tertiary)]">
                        {project.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium text-[var(--color-text-primary)]">
                          {project.name}
                        </p>
                        <p className="text-sm text-[var(--color-text-tertiary)]">
                          {emulationLabel(project.emulationType)}
                        </p>
                      </div>
                      <CompatibilityBadge compatibility={project.compatibility} />
                    </div>
                  );
                })}
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
      </motion.div>
    </Container>
  );
}
