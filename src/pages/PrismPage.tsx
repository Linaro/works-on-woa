import { useTranslation } from "react-i18next";
import { Container } from "@/components/Common/Container";
import { ScrollReveal } from "@/components/Common/ScrollReveal";
import { GradientText } from "@/components/Common/GradientText";

export default function PrismPage() {
  const { t } = useTranslation();

  return (
    <main id="main-content" className="pt-28">
      <Container className="pb-20">
        <ScrollReveal className="text-center">
          <GradientText as="h1" className="text-4xl font-bold md:text-5xl">
            {t("prismPage.title")}
          </GradientText>
          <p className="mt-3 text-lg text-[var(--color-text-secondary)]">
            {t("prismPage.subtitle")}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="mx-auto mt-12 max-w-3xl">
          <div className="space-y-8">
            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                What is Prism?
              </h2>
              <p className="mt-3 leading-relaxed text-[var(--color-text-secondary)]">
                Prism is Microsoft's built-in emulation technology for Windows on ARM. It
                translates x86 and x64 application code to run on ARM64 processors in
                real-time, enabling thousands of existing Windows applications to work
                without any modification.
              </p>
            </section>

            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                How it works
              </h2>
              <p className="mt-3 leading-relaxed text-[var(--color-text-secondary)]">
                When you launch an x86 or x64 application on an ARM device, Prism
                intercepts the binary instructions and translates them to ARM64 code on
                the fly. The translated code is cached for faster subsequent launches.
                This process is transparent to both users and developers.
              </p>
            </section>

            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                Performance considerations
              </h2>
              <p className="mt-3 leading-relaxed text-[var(--color-text-secondary)]">
                While emulated apps run well for most use cases, native ARM64 applications
                will always deliver the best performance, lower power consumption, and
                longer battery life. Microsoft recommends developers target ARM64 natively
                when possible.
              </p>
            </section>

            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                Compatibility
              </h2>
              <p className="mt-3 leading-relaxed text-[var(--color-text-secondary)]">
                Prism supports the vast majority of x86 and x64 Windows applications.
                Some applications that use kernel-mode drivers or specialized hardware
                interfaces may require native ARM64 versions. Check our compatibility
                database at the Apps page for specific application status.
              </p>
            </section>
          </div>
        </ScrollReveal>
      </Container>
    </main>
  );
}
