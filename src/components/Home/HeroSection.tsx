import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/Common/Container";
import { SearchBar } from "@/components/Common/SearchBar";
import { GradientText } from "@/components/Common/GradientText";
import { ScrollReveal } from "@/components/Common/ScrollReveal";

export function HeroSection() {
  const { t } = useTranslation();
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

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
    <section className="relative min-h-[100vh] overflow-visible bg-[var(--color-bg-primary)]">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(0,120,212,0.08) 0%, transparent 70%)",
          animation: "pulse 4s ease-in-out infinite",
        }}
      />

      <Container className="relative flex min-h-[100vh] flex-col items-center justify-center text-center">
        <ScrollReveal>
          <GradientText
            as="h1"
            className="text-5xl font-bold leading-[1.05] md:text-[72px]"
          >
            {t("hero.title")}
          </GradientText>
        </ScrollReveal>

                <ScrollReveal delay={0.1}>
          <p className="mt-4 max-w-xl text-lg text-[var(--color-text-secondary)] md:text-2xl md:font-normal">
            {t("hero.subtitle")}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3} className="relative z-20 mt-10 w-full max-w-[720px]">
          <SearchBar placeholder={t("hero.searchPlaceholder")} />
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-5 flex items-center gap-2.5 text-[15px] text-[var(--color-text-tertiary)]">
            <span>{t("hero.supportedBy")}</span>
            <img
              src="/microsoft-logo.png"
              alt="Microsoft"
              className="h-5 w-auto"
            />
          </div>
        </ScrollReveal>

      </Container>

      {/* Scroll indicator line */}
      <div
        className={`absolute bottom-0 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 transition-all duration-300 ${
          showScrollIndicator
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <span className="text-xs tracking-widest uppercase text-[var(--color-text-tertiary)] opacity-70">{t("common.scroll")}</span>
        <div
          className="h-16"
          style={{
            width: "2px",
            background: "linear-gradient(to bottom, var(--color-text-tertiary), transparent)",
            clipPath: "polygon(0 0, 100% 0, 60% 100%, 40% 100%)",
          }}
        />
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        }
      `}</style>
    </section>
  );
}
