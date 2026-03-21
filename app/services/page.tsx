import PageIntro from "@/components/PageIntro";
import ServicesCatalog from "@/components/ServicesCatalog";
import { siteConfig } from "@/config/site";

export default function ServicesPage() {
  return (
    <div className="section-shell py-16">
      <div className="panel p-8 md:p-10">
        <PageIntro
          eyebrow="Services"
          title="A premium catalog with simple filtering"
          description="Each service card includes category, description, duration, pricing, and a direct booking action to keep the path to conversion short."
        />
        <div className="mt-10">
          <ServicesCatalog services={siteConfig.services} />
        </div>
      </div>
    </div>
  );
}
