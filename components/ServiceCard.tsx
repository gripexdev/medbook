import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/lib/types";
import { buttonClasses } from "@/components/Button";

type ServiceCardProps = Service & {
  compact?: boolean;
};

export default function ServiceCard({
  id,
  category,
  name,
  description,
  duration,
  price,
  image,
  compact = false
}: ServiceCardProps) {
  return (
    <article className="card group flex h-full flex-col overflow-hidden transition hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-jira-border bg-jira-bg">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 44vw, 100vw"
        />
        <div className="absolute left-3 top-3">
          <span className="badge bg-white/90 text-jira-text-secondary shadow-sm backdrop-blur">
            {category}
          </span>
        </div>
      </div>
      <div className="flex h-full flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-jira-text-secondary">{duration}</span>
          <span className="text-sm font-semibold text-jira-text-primary">{price}</span>
        </div>
        <h3 className="mt-2 text-sm font-semibold tracking-tight text-jira-text-primary">
          {name}
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-jira-text-secondary">{description}</p>
        {!compact ? (
          <Link
            href={`/booking?service=${id}`}
            className={buttonClasses("primary", "md", true, "mt-4")}
          >
            Book this service
          </Link>
        ) : (
          <Link
            href={`/booking?service=${id}`}
            className="mt-auto flex items-center gap-1 pt-4 text-xs font-semibold text-brand-500 transition hover:text-brand-400"
          >
            Book now
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor"><path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L11.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 1 1-1.04-1.08l3.158-2.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" /></svg>
          </Link>
        )}
      </div>
    </article>
  );
}
