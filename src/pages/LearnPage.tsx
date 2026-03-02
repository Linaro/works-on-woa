import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Cpu, Monitor } from "lucide-react";
import { Container } from "@/components/Common/Container";
import { ScrollReveal } from "@/components/Common/ScrollReveal";
import { GradientText } from "@/components/Common/GradientText";

const LEARN_CARDS = [
  {
    titleKey: "gettingStarted.title",
    subtitleKey: "gettingStarted.subtitle",
    icon: BookOpen,
    href: "/learn/getting-started",
    gradient: "linear-gradient(135deg, #0078d4, #50e6ff)",
  },
  {
    titleKey: "prismPage.title",
    subtitleKey: "prismPage.subtitle",
    icon: Cpu,
    href: "/learn/prism",
    gradient: "linear-gradient(135deg, #50e6ff, #00bcf2)",
  },
  {
    titleKey: "windowsOnArmPage.title",
    subtitleKey: "windowsOnArmPage.subtitle",
    icon: Monitor,
    href: "/learn/windows-on-arm",
    gradient: "linear-gradient(135deg, #00bcf2, #0078d4)",
  },
];

export default function LearnPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <main id="main-content" className="pt-28">
      <Container className="pb-20">
        <ScrollReveal className="text-center">
          <GradientText as="h1" className="text-4xl font-bold md:text-5xl">
            {t("learn.title")}
          </GradientText>
          <p className="mt-3 text-lg text-[var(--color-text-secondary)]">
            {t("learn.subtitle")}
          </p>
        </ScrollReveal>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
          {LEARN_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <ScrollReveal key={card.href} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => navigate(card.href)}
                  className="group cursor-pointer rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6 transition-colors hover:border-[rgba(0,120,212,0.3)]"
                >
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ background: card.gradient }}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                    {t(card.titleKey)}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                    {t(card.subtitleKey)}
                  </p>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </Container>
    </main>
  );
}
