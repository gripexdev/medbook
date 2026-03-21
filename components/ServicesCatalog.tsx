"use client";

import { useState } from "react";
import { buttonClasses } from "@/components/Button";
import ServiceCard from "@/components/ServiceCard";
import type { Service, ServiceCategory } from "@/lib/types";

type ServicesCatalogProps = {
  services: Service[];
};

export default function ServicesCatalog({ services }: ServicesCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | "All">("All");

  const categories = ["All", ...new Set(services.map((service) => service.category))] as Array<
    ServiceCategory | "All"
  >;

  const filteredServices =
    activeCategory === "All"
      ? services
      : services.filter((service) => service.category === activeCategory);

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={buttonClasses(
              activeCategory === category ? "primary" : "secondary",
              "sm"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {filteredServices.map((service) => (
          <ServiceCard key={service.id} {...service} />
        ))}
      </div>
    </div>
  );
}
