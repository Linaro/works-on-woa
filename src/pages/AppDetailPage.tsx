import { useParams } from "react-router-dom";
import { ProjectDetailView } from "@/components/Projects/ProjectDetailView";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useProject } from "@/data/hooks/useProject";

export default function AppDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project } = useProject(slug ?? "");
  usePageTitle(project?.name);

  if (!slug) return null;

  return (
    <main id="main-content" className="pt-0">
      <ProjectDetailView slug={slug} type="application" />
    </main>
  );
}
