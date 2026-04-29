import { useTranslation } from "react-i18next";
import { PublishersList } from "@/components/Publishers/PublishersList";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function PublishersPage() {
  const { t } = useTranslation();
  usePageTitle("Publishers");

  return (
    <main id="main-content">
      <div className="pt-14 pb-4 text-center">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] md:text-4xl">
          {t("publishers.title")}
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          {t("publishers.subtitle")}
        </p>
      </div>
      <PublishersList />
    </main>
  );
}
