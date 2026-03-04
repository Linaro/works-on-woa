import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Copy, Plus, X } from "lucide-react";
import { Container } from "@/components/Common/Container";
import { BackButton } from "@/components/Common/BackButton";
import { Button } from "@/components/Common/Button";
import { ProjectTable } from "@/components/Common/ProjectTable";
import { Pagination } from "@/components/Common/Pagination";
import { Skeleton, TableSkeleton } from "@/components/Common/Skeleton";
import { usePublisherBySlug, useProjectsByPublisher } from "@/data/hooks/usePublishers";
import { getProvider } from "@/data/provider";
import { addBulkReportSlugs, removeBulkReportSlug, useBulkReport } from "@/lib/bulk-report";

interface PublisherDetailViewProps {
  slug: string;
}

const PAGE_SIZE = 24;

export function PublisherDetailView({ slug }: PublisherDetailViewProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [isAddingAllApps, setIsAddingAllApps] = useState(false);
  const [reportHover, setReportHover] = useState(false);
  const [copied, setCopied] = useState(false);
  const bulkReport = useBulkReport();

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

  const handleAddAllApps = async () => {
    if (!publisher?.name) return;
    setIsAddingAllApps(true);
    try {
      const result = await getProvider().getProjectsByPublisher(
        publisher.name,
        1,
        100000
      );
      const allSlugs = result.items.map((item) => item.slug);
      addBulkReportSlugs(allSlugs);
    } finally {
      setIsAddingAllApps(false);
    }
  };

  const handleRemoveAllApps = async () => {
    if (!publisher?.name) return;
    setIsAddingAllApps(true);
    try {
      const result = await getProvider().getProjectsByPublisher(
        publisher.name,
        1,
        100000
      );
      for (const item of result.items) {
        removeBulkReportSlug(item.slug);
      }
    } finally {
      setIsAddingAllApps(false);
    }
  };

  const allPublisherSlugsInReport =
    projectsData && projectsData.items.length > 0
      ? projectsData.items.every((item) => bulkReport.hasSlug(item.slug))
      : false;

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
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={async () => {
                await navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? (
                <><Check className="mr-1 h-4 w-4" /> Copied!</>
              ) : (
                <><Copy className="mr-1 h-4 w-4" /> Share</>
              )}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onMouseEnter={() => setReportHover(true)}
              onMouseLeave={() => setReportHover(false)}
              disabled={isAddingAllApps || (publisher.appCount === 0 && publisher.gameCount === 0)}
              onClick={() => {
                if (allPublisherSlugsInReport) {
                  handleRemoveAllApps();
                } else {
                  handleAddAllApps();
                }
              }}
            >
              {allPublisherSlugsInReport ? (
                reportHover ? (
                  <><X className="mr-1 h-4 w-4" /> {t("bulkReport.removeFromReport")}</>
                ) : (
                  <><Check className="mr-1 h-4 w-4" /> {t("bulkReport.inReport")}</>
                )
              ) : (
                <><Plus className="mr-1 h-4 w-4" /> {t("bulkReport.addAllPublisherApps")}</>
              )}
            </Button>
          </div>
        </div>

        {/* Projects Table */}
        <div>
          {projLoading ? (
            <TableSkeleton rows={PAGE_SIZE} />
          ) : projectsData && projectsData.items.length > 0 ? (
            <ProjectTable
              items={projectsData.items}
              columns={["icon", "name", "compatibility", "type", "category", "validation", "updated"]}
              actionMode="add-remove"
              sortable
            />
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg text-[var(--color-text-secondary)]">
                {t("common.noResults")}
              </p>
            </div>
          )}
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </motion.div>
    </Container>
  );
}
