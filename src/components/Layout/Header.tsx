import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";
import { LanguageSelector } from "@/components/Common/LanguageSelector";
import { MobileMenu } from "./MobileMenu"

export function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [appCompatOpen, setAppCompatOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const appCompatRef = useRef<HTMLDivElement>(null);
  const learnRef = useRef<HTMLDivElement>(null);
  const appCompatTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const learnTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const openAppCompat = useCallback(() => {
    clearTimeout(appCompatTimeout.current);
    setAppCompatOpen(true);
  }, []);

  const closeAppCompat = useCallback(() => {
    appCompatTimeout.current = setTimeout(() => setAppCompatOpen(false), 150);
  }, []);

  const openLearn = useCallback(() => {
    clearTimeout(learnTimeout.current);
    setLearnOpen(true);
  }, []);

  const closeLearn = useCallback(() => {
    learnTimeout.current = setTimeout(() => setLearnOpen(false), 150);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setAppCompatOpen(false);
    setLearnOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    return () => {
      clearTimeout(appCompatTimeout.current);
      clearTimeout(learnTimeout.current);
    };
  }, []);

  const navLinkClass = (path: string) =>
    cn(
      "relative text-[15px] font-medium transition-colors duration-200",
      location.pathname === path || location.pathname.startsWith(path + "/")
        ? "text-[var(--color-text-primary)]"
        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
    );

  return (
    <>
      <header
        className="fixed left-6 right-6 top-6 z-50 mx-auto flex h-14 max-w-[1200px] items-center justify-between rounded-[12px] px-5 glass"
        role="banner"
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-[15px] font-semibold text-[var(--color-text-primary)]"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect x="1" y="1" width="8.5" height="8.5" fill="#f25022" />
            <rect x="10.5" y="1" width="8.5" height="8.5" fill="#7fba00" />
            <rect x="1" y="10.5" width="8.5" height="8.5" fill="#00a4ef" />
            <rect x="10.5" y="10.5" width="8.5" height="8.5" fill="#ffb900" />
          </svg>
          <span>Works on WoA</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          <div
            ref={appCompatRef}
            className="relative"
            onMouseEnter={openAppCompat}
            onMouseLeave={closeAppCompat}
          >
            <button
              aria-expanded={appCompatOpen}
              className={cn(
                "relative flex cursor-pointer items-center gap-1 text-[15px] font-medium transition-colors duration-200",
                location.pathname.startsWith("/apps") ||
                  location.pathname.startsWith("/games") ||
                  location.pathname.startsWith("/custom-report")
                  ? "text-[var(--color-text-primary)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              )}
            >
              {t("nav.appCompat")}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            <AnimatePresence>
              {appCompatOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-0 top-full z-50 mt-3 w-max rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] py-1 shadow-lg"
                >
                  <Link
                    to="/apps"
                    className="block px-4 py-2.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--color-text-primary)]"
                  >
                    {t("nav.apps")}
                  </Link>
                  <Link
                    to="/games"
                    className="block px-4 py-2.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--color-text-primary)]"
                  >
                    {t("nav.games")}
                  </Link>
                  <Link
                    to="/custom-report"
                    className="block px-4 py-2.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--color-text-primary)]"
                  >
                    {t("nav.customReport")}
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/publishers" className={navLinkClass("/publishers")}>
            {t("nav.publishers")}
          </Link>

          {/* Learn Dropdown */}
          <div
            ref={learnRef}
            className="relative"
            onMouseEnter={openLearn}
            onMouseLeave={closeLearn}
          >
            <button
              aria-expanded={learnOpen}
              className={cn(
                navLinkClass("/learn"),
                "flex cursor-pointer items-center gap-1"
              )}
            >
              {t("nav.learn")}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            <AnimatePresence>
              {learnOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-0 top-full z-50 mt-3 w-max rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] py-1 shadow-lg"
                >
                <Link
                  to="/learn/getting-started"
                  className="block px-4 py-2.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--color-text-primary)]"
                >
                  {t("nav.gettingStarted")}
                </Link>
                <Link
                  to="/learn/prism"
                  className="block px-4 py-2.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--color-text-primary)]"
                >
                  {t("nav.prism")}
                </Link>
                <Link
                  to="/learn/windows-on-arm"
                  className="block px-4 py-2.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--color-text-primary)]"
                >
                  {t("nav.windowsOnArm")}
                </Link>
                <Link
                  to="/faq"
                  className="block px-4 py-2.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--color-text-primary)]"
                >
                  {t("nav.faq")}
                </Link>
              </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="cursor-pointer p-2 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)] lg:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect
                x="0"
                y={mobileOpen ? "7.25" : "4"}
                width="16"
                height="1.5"
                fill="currentColor"
                style={{
                  transformOrigin: "8px 8px",
                  transform: mobileOpen ? "rotate(45deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease, y 0.3s ease",
                }}
              />
              <rect
                x="0"
                y={mobileOpen ? "7.25" : "10.5"}
                width="16"
                height="1.5"
                fill="currentColor"
                style={{
                  transformOrigin: "8px 8px",
                  transform: mobileOpen ? "rotate(-45deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease, y 0.3s ease",
                }}
              />
            </svg>
          </button>
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
