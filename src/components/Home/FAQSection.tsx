import { useTranslation } from "react-i18next";
import { Container } from "@/components/Common/Container";
import { ScrollReveal } from "@/components/Common/ScrollReveal";
import { GradientText } from "@/components/Common/GradientText";
import { Button } from "@/components/Common/Button";
import { Accordion } from "@/components/Common/Accordion";

export function FAQSection() {
  const { t } = useTranslation();

  const faqItems = (t("faq.items", { returnObjects: true }) ?? []) as Array<{
    question: string;
    answer: string;
  }>;

  return (
    <section className="relative">
      <Container className="py-20 md:py-section-desktop">
        {/* Title & CTA */}
        <ScrollReveal className="text-center">
          <GradientText as="h2" className="text-3xl font-semibold md:text-5xl">
            {t("faq.title")}
          </GradientText>
          <p className="mt-4 text-[var(--color-text-secondary)]">
            {t("faq.subtitle")}
          </p>
          <Button
            variant="secondary"
            className="mt-6"
            onClick={() =>
              window.open(
                "https://github.com/nicedoc/works-on-woa/issues",
                "_blank"
              )
            }
          >
            {t("faq.askQuestion")}
          </Button>
        </ScrollReveal>

        {/* Accordions */}
        <ScrollReveal delay={0.15} className="mx-auto mt-12 max-w-3xl">
          <div className="flex flex-col gap-3">
            {Array.isArray(faqItems) &&
              faqItems.map((item, i) => (
                <Accordion
                  key={i}
                  title={item.question}
                  defaultOpen={i === 0}
                >
                  <p
                    className="text-[var(--color-text-secondary)] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                  />
                </Accordion>
              ))}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
