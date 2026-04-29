import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { ProjectDetailView } from "@/components/Projects/ProjectDetailView";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useProject } from "@/data/hooks/useProject";

export default function AppDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project } = useProject(slug ?? "");
  const pageProps = useMemo(() => project ? {
    name: project.name,
    slug: project.slug,
    categories: project.categories.join(", "),
    publisher: project.publisher,
    isMicrosoftApp: String(project.isMicrosoftApp ?? false),
  } : undefined, [project]);
  usePageTitle(project?.name, pageProps);

  if (!slug) return null;

  return (
    <main id="main-content" className="pt-0">
      <ProjectDetailView slug={slug} type="application" />
    </main>
  );
}
