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

  const categories = ["All", ...new Set(services.map((s) => s.category))] as Array<ServiceCategory | "All">;

  const filteredServices =
    activeCategory === "All"
      ? services
      : services.filter((s) => s.category === activeCategory);

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={buttonClasses(
              activeCategory === category ? "primary" : "secondary",
              "sm",
              false,
              "whitespace-nowrap"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {filteredServices.map((service) => (
          <ServiceCard key={service.id} {...service} />
        ))}
      </div>
    </div>
  );
}
