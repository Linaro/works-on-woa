import { useEffect, useState } from "react";
import { Container } from "@/components/Common/Container";
import { ScrollReveal } from "@/components/Common/ScrollReveal";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function WindowsOnArmPage() {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  usePageTitle("Windows on Arm");

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 10) {
        setShowScrollIndicator(true);
      } else if (currentScrollY > lastScrollY) {
        setShowScrollIndicator(false);
      } else if (currentScrollY < lastScrollY) {
        setShowScrollIndicator(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main id="main-content">
      <section className="relative min-h-[100vh] overflow-visible bg-[var(--color-bg-primary)]">
        <Container className="relative flex min-h-[100vh] flex-col items-center justify-center text-center">
          <ScrollReveal className="w-full max-w-4xl">
            <div className="mx-auto mb-6 w-full rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
              <div
                className="h-48 w-full rounded-2xl md:h-64"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(0,120,212,0.24) 0%, rgba(80,230,255,0.14) 45%, rgba(255,255,255,0.04) 100%)",
                }}
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <img
              src="/windows-11-logo-temp.png"
              alt="Windows 11"
              className="mx-auto mb-4 h-7 w-auto md:h-9"
            />
            <h1 className="text-4xl font-bold leading-tight text-[var(--color-text-primary)] md:text-6xl">
              Turbocharged by ARM.
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-[var(--color-text-secondary)] md:text-2xl md:font-normal">
              ARM devices deliver exceptional performance and efficiency, custom
              technologies, and are AI ready.
            </p>
          </ScrollReveal>
        </Container>

        <div
          className={`absolute bottom-0 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 transition-all duration-300 ${
            showScrollIndicator
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-2 opacity-0"
          }`}
        >
          <span className="text-xs tracking-widest uppercase text-[var(--color-text-tertiary)] opacity-70">
            Scroll
          </span>
          <div
            className="h-16"
            style={{
              width: "2px",
              background:
                "linear-gradient(to bottom, var(--color-text-tertiary), transparent)",
              clipPath: "polygon(0 0, 100% 0, 60% 100%, 40% 100%)",
            }}
          />
        </div>
      </section>

      <Container className="pb-20">

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
