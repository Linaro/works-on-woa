import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/Common/Container";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer
      className="border-t border-[rgba(255,255,255,0.06)] bg-[var(--color-bg-primary)]"
      role="contentinfo"
    >
      <Container className="pb-10 pt-20">
        {/* Links Grid */}
        <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          <FooterColumn title={t("footer.columns.product.title")}>
            <FooterLink to="/apps">{t("footer.columns.product.apps")}</FooterLink>
            <FooterLink to="/games">{t("footer.columns.product.games")}</FooterLink>
            <FooterLink to="/publishers">{t("footer.columns.product.publishers")}</FooterLink>
          </FooterColumn>

          <FooterColumn title={t("footer.columns.learn.title")}>
            <FooterLink to="/learn/getting-started">
              {t("footer.columns.learn.gettingStarted")}
            </FooterLink>
            <FooterLink to="/learn/prism">
              {t("footer.columns.learn.prism")}
            </FooterLink>
            <FooterLink to="/learn/windows-on-arm">
              {t("footer.columns.learn.windowsOnArm")}
            </FooterLink>
            <FooterLink to="/faq">
              {t("footer.columns.learn.faq")}
            </FooterLink>
          </FooterColumn>

          <FooterColumn title={t("footer.columns.community.title")}>
            <FooterExternalLink href="https://github.com/Linaro/works-on-woa">
              {t("footer.columns.community.github")}
            </FooterExternalLink>
            <FooterExternalLink href="https://github.com/Linaro/works-on-woa/issues">
              {t("footer.columns.community.reportIssue")}
            </FooterExternalLink>
            <FooterExternalLink href="https://github.com/Linaro/works-on-woa/blob/main/README.md">
              {t("footer.columns.community.contribute")}
            </FooterExternalLink>
          </FooterColumn>

          <FooterColumn title={t("footer.columns.microsoft.title")}>
            <FooterExternalLink href="https://microsoft.com">
              {t("footer.columns.microsoft.website")}
            </FooterExternalLink>
            <FooterExternalLink href="https://privacy.microsoft.com">
              {t("footer.columns.microsoft.privacy")}
            </FooterExternalLink>
            <FooterExternalLink href="https://www.microsoft.com/en-us/legal/terms-of-use">
              {t("footer.columns.microsoft.terms")}
            </FooterExternalLink>
          </FooterColumn>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[rgba(255,255,255,0.06)] pt-6 md:flex-row">
          <div className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
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
            <span className="text-[13px] text-[var(--color-text-tertiary)]">
              {t("footer.copyright", { year: new Date().getFullYear() })}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://privacy.microsoft.com"
              className="text-[13px] text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-secondary)]"
            >
              {t("footer.legal.privacy")}
            </a>
            <a
              href="https://www.microsoft.com/en-us/legal/terms-of-use"
              className="text-[13px] text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-secondary)]"
            >
              {t("footer.legal.terms")}
            </a>
            <a
              href="#"
              className="text-[13px] text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-secondary)]"
            >
              {t("footer.legal.cookies")}
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h5 className="text-[13px] font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
        {title}
      </h5>
      <div className="mt-4 flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

function FooterLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="text-[15px] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
    >
      {children}
    </Link>
  );
}

function FooterExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[15px] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
    >
      {children}
    </a>
  );
}
