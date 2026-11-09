import { useTranslation } from "react-i18next";
import { ProjectsList } from "@/components/Projects/ProjectsList";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAppsSubtitle } from "@/hooks/useAppsSubtitle";

export default function AppsPage() {
  const { t } = useTranslation();
  const subtitle = useAppsSubtitle();
  usePageTitle("Apps");

  return (
    <main id="main-content">
      <div className="pt-14 pb-4 text-center">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] md:text-4xl">
          {t("nav.apps")}
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          {subtitle}
        </p>
      </div>
      <ProjectsList type="application" />
    </main>
  );
}
