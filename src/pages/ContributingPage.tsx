import { useTranslation } from "react-i18next";
import { Container } from "@/components/Common/Container";
import { ScrollReveal } from "@/components/Common/ScrollReveal";
import { GradientText } from "@/components/Common/GradientText";
import { usePageTitle } from "@/hooks/usePageTitle";
import { formatCategory } from "@/utils/formatting";
import { ExternalLink } from "lucide-react";

export default function ContributingPage() {
  const { t } = useTranslation();
  usePageTitle("Contributing");

  return (
    <main id="main-content" className="pt-28">
      <Container className="pb-20">
        <ScrollReveal className="text-center">
          <GradientText as="h1" className="text-4xl font-bold md:text-5xl">
            {t("contributing.title")}
          </GradientText>
          <p className="mt-3 text-lg text-[var(--color-text-secondary)]">
            {t("contributing.subtitle")}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="mx-auto mt-12 max-w-3xl">
          <div className="space-y-8">
            {/* Request Form */}
            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                {t("contributing.form.title")}
              </h2>
              <p
                className="mt-3 leading-relaxed text-[var(--color-text-secondary)]"
                dangerouslySetInnerHTML={{
                  __html: t("contributing.form.description"),
                }}
              />
              <a
                href="https://forms.office.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbR6l5AWBOr4JBj12WisgeWgBUMlgzNk5CSFYzQzRWMlc0MFhRRjdQR0xSSC4u&route=shorturl"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-accent-primary)] px-6 py-2.5 text-[15px] font-medium text-white transition-colors duration-200 hover:bg-[var(--color-accent-hover)]"
              >
                {t("contributing.form.button")}
                <ExternalLink className="h-4 w-4" />
              </a>
            </section>

            {/* GitHub Contribution */}
            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                {t("contributing.github.title")}
              </h2>
              <div className="mt-3 space-y-3 text-[var(--color-text-secondary)] leading-relaxed">
                <p>{t("contributing.github.step1")}</p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: t("contributing.github.step2"),
                  }}
                />
                <p>{t("contributing.github.step3")}</p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: t("contributing.github.step4"),
                  }}
                />
                <p>{t("contributing.github.step5")}</p>
              </div>
            </section>

            {/* Project Schema */}
            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                {t("contributing.schema.title")}
              </h2>
              <p
                className="mt-3 leading-relaxed text-[var(--color-text-secondary)]"
                dangerouslySetInnerHTML={{
                  __html: t("contributing.schema.description"),
                }}
              />
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)]">
                      <th className="px-3 py-2 text-left font-medium text-[var(--color-text-primary)]">
                        {t("contributing.schema.field")}
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-[var(--color-text-primary)]">
                        {t("contributing.schema.type")}
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-[var(--color-text-primary)]">
                        {t("contributing.schema.descriptionCol")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--color-text-secondary)]">
                    {(
                      t("contributing.schema.fields", {
                        returnObjects: true,
                      }) as Array<{
                        field: string;
                        type: string;
                        description: string;
                      }>
                    ).map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-[var(--color-border)] last:border-0"
                      >
                        <td className="px-3 py-2 font-mono text-xs">
                          {row.field}
                        </td>
                        <td className="px-3 py-2 text-xs">{row.type}</td>
                        <td
                          className="px-3 py-2"
                          dangerouslySetInnerHTML={{
                            __html: row.description,
                          }}
                        />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Example Entry */}
            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                {t("contributing.example.title")}
              </h2>
              <p className="mt-3 leading-relaxed text-[var(--color-text-secondary)]">
                {t("contributing.example.description")}
              </p>
              <pre className="mt-4 overflow-x-auto rounded-lg bg-[var(--color-bg-primary)] p-4 text-sm text-[var(--color-text-secondary)]">
                <code>{t("contributing.example.code")}</code>
              </pre>
            </section>

            {/* Categories */}
            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                {t("contributing.categories.title")}
              </h2>
              <p className="mt-3 leading-relaxed text-[var(--color-text-secondary)]">
                {t("contributing.categories.description")}
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)]">
                      <th className="px-3 py-2 text-left font-medium text-[var(--color-text-primary)]">
                        {t("contributing.categories.tagColumn")}
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-[var(--color-text-primary)]">
                        {t("contributing.categories.nameColumn")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--color-text-secondary)]">
                    {(
                      t("contributing.categories.list", {
                        returnObjects: true,
                      }) as string[]
                    ).map((cat) => (
                      <tr
                        key={cat}
                        className="border-b border-[var(--color-border)] last:border-0"
                      >
                        <td className="px-3 py-2 font-mono text-xs">{cat}</td>
                        <td className="px-3 py-2">{formatCategory(cat)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Need Help */}
            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                {t("contributing.help.title")}
              </h2>
              <p
                className="mt-3 leading-relaxed text-[var(--color-text-secondary)]"
                dangerouslySetInnerHTML={{
                  __html: t("contributing.help.description"),
                }}
              />
            </section>
          </div>
        </ScrollReveal>
      </Container>
    </main>
  );
}
