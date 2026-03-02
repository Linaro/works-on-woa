import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/utils/cn";
import "flag-icons/css/flag-icons.min.css";

const LANGUAGES = [
  { code: "en", label: "English", flag: "us" },
  { code: "ja", label: "日本語", flag: "jp" },
  { code: "ko", label: "한국어", flag: "kr" },
  { code: "zh", label: "中文", flag: "cn" },
] as const;

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className }: LanguageSelectorProps) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout>>();

  const currentLang = LANGUAGES.find((l) => i18n.language.startsWith(l.code)) ?? LANGUAGES[0];

  const openMenu = useCallback(() => {
    clearTimeout(closeTimeout.current);
    setIsOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    closeTimeout.current = setTimeout(() => setIsOpen(false), 150);
  }, []);

  useEffect(() => {
    return () => clearTimeout(closeTimeout.current);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)} onMouseEnter={openMenu} onMouseLeave={closeMenu}>
      <button
        aria-label="Select language"
        aria-expanded={isOpen}
        className="flex cursor-pointer items-center gap-1.5 rounded-lg p-2 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
      >
        <span className={`fi fi-${currentLang.flag}`} style={{ fontSize: "1rem", borderRadius: "10%" }} />
        <span className="text-xs font-medium uppercase mr-0.5">
          {currentLang.code}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 top-full z-50 mt-2 min-w-[160px] rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] py-1 shadow-lg"
          >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                setIsOpen(false);
              }}
              className={cn(
                "flex w-full cursor-pointer items-center gap-2.5 px-4 py-2 text-sm transition-colors",
                i18n.language.startsWith(lang.code)
                  ? "text-[var(--color-accent-primary)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[rgba(255,255,255,0.04)]"
              )}
            >
              <span className={`fi fi-${lang.flag}`} style={{ fontSize: "1rem", borderRadius: "10%" }} />
              {lang.label}
            </button>
          ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
