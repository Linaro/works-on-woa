import { useTranslation } from "react-i18next";
import { Container } from "@/components/Common/Container";
import { ScrollReveal } from "@/components/Common/ScrollReveal";
import { Accordion } from "@/components/Common/Accordion";
import { GradientText } from "@/components/Common/GradientText";

export default function FAQPage() {
  const { t } = useTranslation();

  const faqItems = (t("faq.items", { returnObjects: true }) ?? []) as Array<{
    question: string;
    answer: string;
  }>;

  return (
    <main id="main-content" className="pt-28">
      <Container className="pb-20">
        <ScrollReveal className="text-center">
          <GradientText as="h1" className="text-4xl font-bold md:text-5xl">
            {t("faq.title")}
          </GradientText>
          <p className="mt-3 text-lg text-[var(--color-text-secondary)]">
            {t("faq.subtitle")}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.15} className="mx-auto mt-12 max-w-3xl">
          <div className="flex flex-col gap-3">
            {Array.isArray(faqItems) &&
              faqItems.map((item, i) => (
                <Accordion key={i} title={item.question} defaultOpen={i === 0}>
                  <p className="text-[var(--color-text-secondary)] leading-relaxed">
                    {item.answer}
                  </p>
                </Accordion>
              ))}
          </div>
        </ScrollReveal>
      </Container>
    </main>
  );
}
