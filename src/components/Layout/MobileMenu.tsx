import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40"
          />

          {/* Fullscreen panel — sits directly below the header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed left-6 right-6 top-[5.5rem] bottom-6 z-50 mx-auto max-w-[1200px] rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-6"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              <p className="px-4 py-1.5 text-xs uppercase tracking-wider text-[var(--color-text-tertiary)]">
                {t("nav.appCompat")}
              </p>
              <MobileLink to="/apps" onClick={onClose}>
                {t("nav.apps")}
              </MobileLink>
              <MobileLink to="/games" onClick={onClose}>
                {t("nav.games")}
              </MobileLink>
              <MobileLink to="/custom-report" onClick={onClose}>
                {t("nav.customReport")}
              </MobileLink>

              <div className="my-2 h-px bg-[var(--color-border)]" />

              <MobileLink to="/publishers" onClick={onClose}>
                {t("nav.publishers")}
              </MobileLink>

              <div className="my-2 h-px bg-[var(--color-border)]" />

              <p className="px-4 py-1.5 text-xs uppercase tracking-wider text-[var(--color-text-tertiary)]">
                {t("nav.learn")}
              </p>
              <MobileLink to="#" onClick={onClose}>
                {t("nav.gettingStarted")}
              </MobileLink>
              <a
                href="https://learn.microsoft.com/en-us/windows/arm/apps-on-arm-x86-emulation"
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="rounded-lg px-4 py-3 text-base font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--color-text-primary)]"
              >
                {t("nav.prism")}
              </a>
              <a
                href="https://www.microsoft.com/en-us/windows/windows-11"
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="rounded-lg px-4 py-3 text-base font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--color-text-primary)]"
              >
                {t("nav.windowsOnArm")}
              </a>
              <MobileLink to="/faq" onClick={onClose}>
                {t("nav.faq")}
              </MobileLink>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function MobileLink({
  to,
  children,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="rounded-lg px-4 py-3 text-base font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--color-text-primary)]"
    >
      {children}
    </Link>
  );
}
