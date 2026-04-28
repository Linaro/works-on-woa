import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";
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
            <FooterLink to="/custom-report">{t("footer.columns.product.customReport")}</FooterLink>
          </FooterColumn>

          <FooterColumn title={t("footer.columns.learn.title")}>
            <FooterExternalLink href="https://learn.microsoft.com/en-us/windows/arm/overview">
              {t("footer.columns.learn.gettingStarted")}
            </FooterExternalLink>
            <FooterExternalLink href="https://learn.microsoft.com/en-us/windows/arm/apps-on-arm-x86-emulation">
              {t("footer.columns.learn.prism")}
            </FooterExternalLink>
            <FooterExternalLink href="https://www.microsoft.com/en-us/windows/windows-11">
              {t("footer.columns.learn.windowsOnArm")}
            </FooterExternalLink>
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
            <FooterLink to="/contributing">
              {t("footer.columns.community.contribute")}
            </FooterLink>
            <FooterLink to="/takedown">
              {t("footer.columns.community.takedown")}
            </FooterLink>
            <FooterExternalLink href="https://www.linaro.org/contact/">
              {t("footer.columns.community.contact")}
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

        {/* Disclaimer */}
        <p className="mt-12 text-left text-[11px] text-[var(--color-text-tertiary)]">
          {t("footer.disclaimer")}
        </p>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 border-t border-[rgba(255,255,255,0.12)] pt-6">
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[var(--color-text-tertiary)] text-center">
              {t("footer.copyright", { year: new Date().getFullYear() })}
            </span>
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
      <p className="text-[13px] font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
        {title}
      </p>
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
      className="inline-flex items-center gap-1 text-[15px] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
    >
      {children}
      <ExternalLink className="h-3 w-3 shrink-0" />
    </a>
  );
}
