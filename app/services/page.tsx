import PageIntro from "@/components/PageIntro";
import ServicesCatalog from "@/components/ServicesCatalog";
import { siteConfig } from "@/config/site";

export default function ServicesPage() {
  return (
    <div className="section-shell py-12 md:py-16">
      <div className="rounded-[32px] border border-slate-200/60 bg-white p-6 sm:p-8 md:p-10">
        <PageIntro
          eyebrow="Our Services"
          title="Find the right care for you"
          description="Browse our range of healthcare services. Each includes a detailed description, duration, and pricing so you can make an informed choice."
        />
        <div className="mt-10">
          <ServicesCatalog services={siteConfig.services} />
        </div>
      </div>
    </div>
  );
}
