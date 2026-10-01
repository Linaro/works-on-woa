import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ProjectDetailView } from "@/components/Projects/ProjectDetailView";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useProject } from "@/data/hooks/useProject";
import { getProjectDisplayName } from "@/utils/project-name";

export default function GameDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project } = useProject(slug ?? "");
  const { i18n } = useTranslation();
  const pageProps = useMemo(() => project ? {
    name: project.name,
    slug: project.slug,
    categories: project.categories.join(", "),
    publisher: project.publisher,
    isMicrosoftApp: String(project.isMicrosoftApp ?? false),
  } : undefined, [project]);
  usePageTitle(project ? getProjectDisplayName(project, i18n.language) : undefined, pageProps);

  if (!slug) return null;

  return (
    <main id="main-content" className="pt-0">
      <ProjectDetailView slug={slug} type="game" />
    </main>
  );
}
