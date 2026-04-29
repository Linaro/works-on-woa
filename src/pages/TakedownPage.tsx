import { useTranslation } from "react-i18next";
import { Container } from "@/components/Common/Container";
import { ScrollReveal } from "@/components/Common/ScrollReveal";
import { GradientText } from "@/components/Common/GradientText";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function TakedownPage() {
  const { t } = useTranslation();
  usePageTitle("Content Takedown Request");

  return (
    <main id="main-content" className="pt-28">
      <Container className="pb-20">
        <ScrollReveal className="text-center">
          <GradientText as="h1" className="text-4xl font-bold md:text-5xl">
            {t("takedown.title")}
          </GradientText>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="mx-auto mt-12 max-w-3xl">
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6">
            <p className="leading-relaxed text-[var(--color-text-secondary)]">
              {t("takedown.description")}{" "}
              <a
                href="mailto:it-support@linaro.org "
                className="text-[var(--color-accent-primary)] hover:underline"
              >
                it-support@linaro.org 
              </a>
              {" "}{t("takedown.suffix")}
            </p>
          </section>
        </ScrollReveal>
      </Container>
    </main>
  );
}
