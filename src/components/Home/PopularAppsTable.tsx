import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/Common/Container";
import { ScrollReveal } from "@/components/Common/ScrollReveal";
import { CompatibilityBadge, ValidationBadge } from "@/components/Common/Badge";
import { Button } from "@/components/Common/Button";
import { TableSkeleton } from "@/components/Common/Skeleton";
import { ProjectIcon } from "@/components/Common/ProjectIcon";
import { useProjects } from "@/data/hooks/useProjects";
import { formatDate } from "@/utils/formatting";
import type { ProjectFilters } from "@/data/types";

export function PopularAppsTable() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const filters: ProjectFilters = { type: "application" };
  const { data, isLoading } = useProjects(filters, 1, 10);

  const emulationLabel = (type: string) => {
    switch (type) {
      case "native":
        return t("common.native");
      case "emulation":
        return t("common.emulation");
      default:
        return t("common.unknown");
    }
  };

  return (
    <section className="relative bg-[var(--color-bg-primary)] noise-bg">
      <Container className="pt-20 pb-20 md:pt-16 md:pb-[var(--spacing-section-desktop)]">
        <ScrollReveal className="text-center">
          <h2
            className="text-3xl font-semibold text-[var(--color-text-primary)] md:text-5xl"
            style={{ textShadow: "0 0 40px rgba(0, 120, 212, 0.3)" }}
          >
            {t("popularApps.title")}
          </h2>
          <p className="mt-3 text-lg text-[var(--color-text-secondary)]">
            {t("popularApps.subtitle")}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="mt-8">
          {isLoading ? (
            <TableSkeleton rows={10} />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-hidden rounded-[12px] border border-[rgba(255,255,255,0.06)] bg-[var(--color-bg-surface)] md:block">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] text-[13px] font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                      <th className="px-3 py-3 w-12"></th>
                      <th className="px-4 py-3">{t("popularApps.columns.name")}</th>
                      <th className="px-4 py-3">{t("popularApps.columns.compatibility")}</th>
                      <th className="px-4 py-3">{t("popularApps.columns.type")}</th>
                      <th className="px-4 py-3">{t("popularApps.columns.developer")}</th>
                      <th className="px-4 py-3">{t("popularApps.columns.category")}</th>
                      <th className="px-4 py-3">{t("popularApps.columns.validation")}</th>
                      <th className="px-4 py-3">{t("popularApps.columns.updated")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.items.map((project, i) => (
                      <tr
                        key={project.slug}
                        onClick={() =>
                          navigate(
                            `/${project.type === "application" ? "apps" : "games"}/${project.slug}`
                          )
                        }
                        className={`cursor-pointer border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-bg-surface-hover)] ${
                          i % 2 === 1 ? "bg-[rgba(255,255,255,0.02)]" : ""
                        }`}
                      >
                        <td className="px-3 py-2">
                          <ProjectIcon icon={project.icon} name={project.name} size="xs" />
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
                        <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                          {project.publisher || "—"}
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
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List */}
              <div className="flex flex-col gap-3 md:hidden">
                {data?.items.map((project) => (
                  <div
                    key={project.slug}
                    onClick={() =>
                      navigate(
                        `/${project.type === "application" ? "apps" : "games"}/${project.slug}`
                      )
                    }
                    className="flex cursor-pointer items-center gap-3 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 transition-colors hover:bg-[var(--color-bg-surface-hover)]"
                  >
                    <ProjectIcon icon={project.icon} name={project.name} size="sm" />
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
                ))}
              </div>

              {/* See All Button */}
              <div className="mt-6 flex justify-center">
                <Button
                  variant="secondary"
                  onClick={() => navigate("/apps")}
                >
                  {t("popularApps.seeAll")}
                </Button>
              </div>
            </>
          )}
        </ScrollReveal>
      </Container>
    </section>
  );
}
