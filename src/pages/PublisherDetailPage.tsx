import { useParams } from "react-router-dom";
import { PublisherDetailView } from "@/components/Publishers/PublisherDetailView";

export default function PublisherDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) return null;

  return (
    <main id="main-content" className="pt-0">
      <PublisherDetailView slug={slug} />
    </main>
  );
}
