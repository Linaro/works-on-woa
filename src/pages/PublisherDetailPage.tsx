import { useParams } from "react-router-dom";
import { PublisherDetailView } from "@/components/Publishers/PublisherDetailView";
import { usePageTitle } from "@/hooks/usePageTitle";
import { usePublisherBySlug } from "@/data/hooks/usePublishers";

export default function PublisherDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: publisher } = usePublisherBySlug(slug ?? "");
  usePageTitle(publisher?.name);

  if (!slug) return null;

  return (
    <main id="main-content" className="pt-0">
      <PublisherDetailView slug={slug} />
    </main>
  );
}
