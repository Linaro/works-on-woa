import { useTranslation } from "react-i18next";
import { useProjects } from "@/data/hooks/useProjects";

/**
 * "Windows supports over N popular apps on Arm", with N derived from the
 * application count and rounded down to the nearest thousand so "over" stays
 * accurate. Returns a non-breaking space until the count is available to
 * avoid layout shift.
 */
export function useAppsSubtitle(): string {
  const { t, i18n } = useTranslation();
  const { data } = useProjects({ type: "application" }, 1, 1);

  const rounded = data ? Math.floor(data.total / 1000) * 1000 : 0;
  if (!rounded) return "\u00A0";

  return t("popularApps.subtitle", {
    appCount: rounded.toLocaleString(i18n.language),
  });
}
