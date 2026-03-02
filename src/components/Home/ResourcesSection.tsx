import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Cpu, Monitor } from "lucide-react";
import { Container } from "@/components/Common/Container";
import { ScrollReveal } from "@/components/Common/ScrollReveal";
import { GradientText } from "@/components/Common/GradientText";

const RESOURCES = [
  {
    key: "gettingStarted",
    icon: BookOpen,
    href: "/learn/getting-started",
    gradient: "linear-gradient(135deg, #0078d4, #50e6ff)",
  },
  {
    key: "prism",
    icon: Cpu,
    href: "/learn/prism",
    gradient: "linear-gradient(135deg, #50e6ff, #00bcf2)",
  },
  {
    key: "windowsOnArm",
    icon: Monitor,
    href: "/learn/windows-on-arm",
    gradient: "linear-gradient(135deg, #00bcf2, #0078d4)",
  },
];

export function ResourcesSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="relative">
      <Container className="py-20 md:py-section-desktop">
        <ScrollReveal className="mb-12 text-center">
          <GradientText as="h2" className="text-3xl font-semibold md:text-5xl">
            {t("resources.title")}
          </GradientText>
          <p className="mt-3 text-lg text-[var(--color-text-secondary)]">
            {t("resources.subtitle")}
          </p>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-3">
          {RESOURCES.map((resource, i) => {
            const Icon = resource.icon;
            return (
              <ScrollReveal key={resource.key} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => navigate(resource.href)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6 transition-colors hover:border-[rgba(0,120,212,0.3)]"
                >
                  {/* Glow gradient on hover */}
                  <div
                    className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: resource.gradient,
                      filter: "blur(40px)",
                      opacity: 0,
                    }}
                  />
                  <div
                    className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-10"
                    style={{
                      background: resource.gradient,
                    }}
                  />

                  <div className="relative z-10">
                    <div
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ background: resource.gradient }}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>

                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                      {t(`resources.items.${resource.key}.title`)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                      {t(`resources.items.${resource.key}.description`)}
                    </p>

                    <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent)] transition-transform group-hover:translate-x-1">
                      {t("common.learnMore")}
                      <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
