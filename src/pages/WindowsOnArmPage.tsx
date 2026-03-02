import { useTranslation } from "react-i18next";
import { Container } from "@/components/Common/Container";
import { ScrollReveal } from "@/components/Common/ScrollReveal";
import { GradientText } from "@/components/Common/GradientText";

export default function WindowsOnArmPage() {
  const { t } = useTranslation();

  return (
    <main id="main-content" className="pt-28">
      <Container className="pb-20">
        <ScrollReveal className="text-center">
          <GradientText as="h1" className="text-4xl font-bold md:text-5xl">
            {t("windowsOnArmPage.title")}
          </GradientText>
          <p className="mt-3 text-lg text-[var(--color-text-secondary)]">
            {t("windowsOnArmPage.subtitle")}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="mx-auto mt-12 max-w-3xl">
          <div className="space-y-8">
            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                The full Windows experience
              </h2>
              <p className="mt-3 leading-relaxed text-[var(--color-text-secondary)]">
                Windows 11 on ARM delivers the complete Windows desktop experience
                you know and love, optimized for ARM-powered devices. From the Start
                menu to Snap layouts, Widgets, and Microsoft Copilot — everything
                works seamlessly.
              </p>
            </section>

            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                Copilot+ PCs
              </h2>
              <p className="mt-3 leading-relaxed text-[var(--color-text-secondary)]">
                The latest Windows on ARM devices are Copilot+ PCs, featuring integrated
                Neural Processing Units (NPUs) that enable on-device AI experiences.
                From real-time translation to intelligent photo editing, these devices
                bring AI-powered productivity to your fingertips.
              </p>
            </section>

            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                Performance & battery life
              </h2>
              <p className="mt-3 leading-relaxed text-[var(--color-text-secondary)]">
                ARM-based Windows PCs are engineered for efficiency. Expect all-day
                battery life — up to 22 hours on a single charge — without
                compromising on performance. The Qualcomm Snapdragon X Elite
                processor delivers desktop-class performance in a fanless design.
              </p>
            </section>

            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                App ecosystem
              </h2>
              <p className="mt-3 leading-relaxed text-[var(--color-text-secondary)]">
                With thousands of native ARM64 apps and Prism emulation supporting
                the vast majority of existing x86/x64 applications, Windows on ARM
                offers the broadest app ecosystem of any ARM-based PC platform.
                Check our compatibility database to see which apps are ready.
              </p>
            </section>
          </div>
        </ScrollReveal>
      </Container>
    </main>
  );
}
