import { HeroSection } from "@/components/Home/HeroSection";
import { PopularAppsTable } from "@/components/Home/PopularAppsTable";
import { MicrosoftAppsSection } from "@/components/Home/MicrosoftAppsSection";
import { ResourcesSection } from "@/components/Home/ResourcesSection";
import { FAQSection } from "@/components/Home/FAQSection";

export default function HomePage() {
  return (
    <main id="main-content">
      <HeroSection />
      <MicrosoftAppsSection />
      <PopularAppsTable />
      <ResourcesSection />
      <FAQSection />
    </main>
  );
}
