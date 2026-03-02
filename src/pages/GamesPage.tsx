import { useTranslation } from "react-i18next";
import { ProjectsList } from "@/components/Projects/ProjectsList";

export default function GamesPage() {
  const { t } = useTranslation();

  return (
    <main id="main-content">
      <div className="pt-14 pb-4 text-center">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] md:text-4xl">
          {t("nav.games")}
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          Browse game compatibility on Windows on ARM
        </p>
      </div>
      <ProjectsList type="game" />
    </main>
  );
}
