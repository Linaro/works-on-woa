import { cn } from "@/utils/cn";
import type { Compatibility, Validation } from "@/data/types";
import { useTranslation } from "react-i18next";
import { Shield, Users, CheckCircle } from "lucide-react";

interface CompatibilityBadgeProps {
  compatibility: Compatibility;
  className?: string;
  size?: "sm" | "md";
}

export function CompatibilityBadge({
  compatibility,
  className,
  size = "md",
}: CompatibilityBadgeProps) {
  const { t } = useTranslation();

  const variants: Record<Compatibility, string> = {
    yes: "bg-[var(--color-success)]/15 text-[var(--color-success)] border-[var(--color-success)]/30",
    no: "bg-[var(--color-danger)]/15 text-[var(--color-danger)] border-[var(--color-danger)]/30",
    unknown:
      "bg-[var(--color-warning)]/15 text-[var(--color-warning)] border-[var(--color-warning)]/30",
  };

  const labels: Record<Compatibility, string> = {
    yes: t("common.yes"),
    no: t("common.no"),
    unknown: t("common.unknown"),
  };

  const sizeClasses = size === "sm" ? "px-2 py-px text-[10px]" : "px-2.5 py-0.5 text-xs";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        sizeClasses,
        variants[compatibility],
        className
      )}
    >
      {labels[compatibility]}
    </span>
  );
}

interface ValidationBadgeProps {
  validation: Validation;
  className?: string;
}

export function ValidationBadge({
  validation,
  className,
}: ValidationBadgeProps) {
  const { t } = useTranslation();

  const icons: Record<Validation, React.ReactNode> = {
    microsoft: <Shield className="mr-1 h-3 w-3" />,
    qualcomm: <CheckCircle className="mr-1 h-3 w-3" />,
    developer: <CheckCircle className="mr-1 h-3 w-3" />,
    community: <Users className="mr-1 h-3 w-3" />,
    unverified: null,
  };

  if (validation === "unverified") return null;

  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border border-[var(--color-border)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-text-secondary)]",
        "min-w-fit shrink-0",
        className
      )}
    >
      {icons[validation]}
      {t(`validation.${validation}`)}
    </span>
  );
}
