import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/Common/Container";
import { ScrollReveal } from "@/components/Common/ScrollReveal";
import { GradientText } from "@/components/Common/GradientText";
import { CompatibilityBadge } from "@/components/Common/Badge";
import { CardSkeleton } from "@/components/Common/Skeleton";
import { ProjectIcon } from "@/components/Common/ProjectIcon";
import { useMicrosoftApps } from "@/data/hooks/useMicrosoftApps";

const CATEGORIES = [
  "productivity",
  "communication",
  "creativity",
  "exploration",
  "it-management",
] as const;

export function MicrosoftAppsSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>("productivity");
  const { data, isLoading } = useMicrosoftApps();

  const filteredApps = useMemo(() => {
    if (!data) return [];
    return data.filter(
      (app) => app.microsoftCategory === activeCategory
    );
  }, [data, activeCategory]);

  return (
    <section className="relative overflow-hidden">
      <Container className="py-20 md:py-section-desktop">
        <ScrollReveal className="mb-10 text-center">
          <GradientText as="h2" className="text-3xl font-semibold md:text-5xl">
            {t("microsoftApps.title")}
          </GradientText>
          <p className="mt-3 text-lg text-[var(--color-text-secondary)]">
            {t("microsoftApps.subtitle")}
          </p>
        </ScrollReveal>

        {/* Category Tabs */}
        <ScrollReveal delay={0.1}>
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-2 rounded-xl bg-[var(--color-bg-surface)] p-1.5 border border-[var(--color-border)]">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`cursor-pointer relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
                }`}
              >
                {activeCategory === cat && (
                  <motion.div
                    layoutId="ms-tab"
                    className="absolute inset-0 rounded-lg bg-[rgba(255,255,255,0.08)]"
                    transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                  />
                )}
                <span className="relative z-10">
                  {t(`microsoftApps.categories.${cat}`)}
                </span>
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* App Grid */}
        <div className="mt-10">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-wrap justify-center gap-4"
              >
                {filteredApps.length === 0 ? (
                  <p className="col-span-full py-12 text-center text-[var(--color-text-tertiary)]">
                    {t("common.noResults")}
                  </p>
                ) : (
                  filteredApps.map((app) => (
                    <motion.div
                      key={app.slug}
                      whileHover={{ y: -4, scale: 1.02 }}
                      onClick={() => navigate(`/apps/${app.slug}`)}
                      className="cursor-pointer group flex w-[180px] flex-col items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 text-center transition-colors hover:border-[rgba(0,120,212,0.3)]"
                    >
                      <ProjectIcon icon={app.icon} name={app.name} size="lg" />
                      <div>
                        <p className="font-medium text-[var(--color-text-primary)] text-sm">
                          {app.name}
                        </p>
                        <div className="mt-1.5">
                          <CompatibilityBadge compatibility={app.compatibility} size="sm" />
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </Container>
    </section>
  );
}
