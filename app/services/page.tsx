import PageIntro from "@/components/PageIntro";
import ServicesCatalog from "@/components/ServicesCatalog";
import { siteConfig } from "@/config/site";

export default function ServicesPage() {
  return (
    <div className="page-container">
      <div className="card p-6 sm:p-8">
        <PageIntro
          eyebrow="Our Services"
          title="Find the right care for you"
          description="Browse our range of healthcare services. Each includes a detailed description, duration, and pricing so you can make an informed choice."
        />
        <div className="mt-8">
          <ServicesCatalog services={siteConfig.services} />
        </div>
      </div>
    </div>
  );
}
