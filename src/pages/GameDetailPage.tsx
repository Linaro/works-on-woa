import { useParams } from "react-router-dom";
import { ProjectDetailView } from "@/components/Projects/ProjectDetailView";

export default function GameDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) return null;

  return (
    <main id="main-content" className="pt-0">
      <ProjectDetailView slug={slug} type="game" />
    </main>
  );
}
