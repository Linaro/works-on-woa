import { useTranslation } from "react-i18next";
import { Container } from "@/components/Common/Container";
import { Accordion } from "@/components/Common/Accordion";
import { GradientText } from "@/components/Common/GradientText";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function FAQPage() {
  const { t } = useTranslation();
  usePageTitle("FAQ");

  const faqItems = (t("faq.items", { returnObjects: true }) ?? []) as Array<{
    question: string;
    answer: string;
  }>;

  return (
    <main id="main-content" className="pt-28">
      <Container className="pb-20">
        <div className="text-center">
          <GradientText as="h1" className="text-4xl font-bold md:text-5xl">
            {t("faq.title")}
          </GradientText>
          <p className="mt-3 text-lg text-[var(--color-text-secondary)]">
            {t("faq.subtitle")}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <div className="flex flex-col gap-3">
            {Array.isArray(faqItems) &&
              faqItems.map((item, i) => (
                <Accordion key={i} title={item.question} defaultOpen={i === 0}>
                  <p
                    className="text-[var(--color-text-secondary)] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                  />
                </Accordion>
              ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
