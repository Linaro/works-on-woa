import { useTranslation } from "react-i18next";
import { ProjectsList } from "@/components/Projects/ProjectsList";

export default function AppsPage() {
  const { t } = useTranslation();

  return (
    <main id="main-content">
      <div className="pt-14 pb-4 text-center">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] md:text-4xl">
          {t("nav.apps")}
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          {t("popularApps.subtitle")}
        </p>
      </div>
      <ProjectsList type="application" />
    </main>
  );
}
