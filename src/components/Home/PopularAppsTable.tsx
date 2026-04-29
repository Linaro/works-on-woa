import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/Common/Container";
import { ScrollReveal } from "@/components/Common/ScrollReveal";
import { Button } from "@/components/Common/Button";
import { TableSkeleton } from "@/components/Common/Skeleton";
import { ProjectTable } from "@/components/Common/ProjectTable";
import { trackButtonClick } from "@/lib/telemetry";
import { usePopularProjects } from "@/data/hooks/usePopularProjects";

export function PopularAppsTable() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading } = usePopularProjects(i18n.language, 10);

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
          ) : data ? (
            <ProjectTable
              items={data}
              columns={["icon", "name", "compatibility", "type", "developer", "category", "validation", "updated"]}
              iconSize="xs"
              actionMode="none"
              footer={
                <div className="mt-6 flex justify-center">
                  <Button variant="secondary" onClick={() => { trackButtonClick("Home: See All Windows Apps"); navigate("/apps"); }}>
                    {t("popularApps.seeAll")}
                  </Button>
                </div>
              }
            />
          ) : null}
        </ScrollReveal>
      </Container>
    </section>
  );
}
