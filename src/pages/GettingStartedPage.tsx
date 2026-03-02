import { useTranslation } from "react-i18next";
import { Container } from "@/components/Common/Container";
import { ScrollReveal } from "@/components/Common/ScrollReveal";
import { GradientText } from "@/components/Common/GradientText";

export default function GettingStartedPage() {
  const { t } = useTranslation();

  return (
    <main id="main-content" className="pt-28">
      <Container className="pb-20">
        <ScrollReveal className="text-center">
          <GradientText as="h1" className="text-4xl font-bold md:text-5xl">
            {t("gettingStarted.title")}
          </GradientText>
          <p className="mt-3 text-lg text-[var(--color-text-secondary)]">
            {t("gettingStarted.subtitle")}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="mx-auto mt-12 max-w-3xl">
          <div className="space-y-8">
            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                1. Choose your device
              </h2>
              <p className="mt-3 leading-relaxed text-[var(--color-text-secondary)]">
                Windows on ARM powers a range of devices including Microsoft Surface Pro,
                Lenovo ThinkPad X13s, Samsung Galaxy Book Go, and more. These Copilot+ PCs
                deliver all-day battery life with Qualcomm Snapdragon processors.
              </p>
            </section>

            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                2. Set up your development environment
              </h2>
              <p className="mt-3 leading-relaxed text-[var(--color-text-secondary)]">
                Visual Studio 2022 and Visual Studio Code both run natively on ARM64.
                Install the ARM64 versions for the best performance. Most development
                tools including Node.js, Python, and .NET are available as native ARM64
                builds.
              </p>
            </section>

            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                3. Build ARM-native apps
              </h2>
              <p className="mt-3 leading-relaxed text-[var(--color-text-secondary)]">
                Target ARM64 in your build configuration to create native apps that take
                full advantage of ARM processors. Native apps launch faster, use less
                memory, and provide better battery life than emulated alternatives.
              </p>
            </section>

            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                4. Test and validate
              </h2>
              <p className="mt-3 leading-relaxed text-[var(--color-text-secondary)]">
                Use the Windows on ARM compatibility tools to test your applications.
                Check for any x86/x64 dependencies that may need to be recompiled,
                and validate performance meets your requirements.
              </p>
            </section>
          </div>
        </ScrollReveal>
      </Container>
    </main>
  );
}
