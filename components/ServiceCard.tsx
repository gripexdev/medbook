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
    <article className="panel hover-lift group flex h-full flex-col overflow-hidden p-0">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-slate-100/90 bg-slate-50">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 44vw, 100vw"
        />
      </div>
      <div className="flex h-full flex-col p-5 sm:p-6">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            {category}
          </span>
          <span className="text-sm font-semibold text-brand-700">{price}</span>
        </div>
        <h3 className="mt-5 font-display text-[22px] font-semibold leading-tight tracking-[-0.03em] text-slate-950 sm:text-[24px]">
          {name}
        </h3>
        <p className="mt-4 text-sm leading-7 text-slate-600">{description}</p>
        <div className="mt-6 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>{duration}</span>
          <span>Premium care</span>
        </div>
        {!compact ? (
          <Link
            href={`/booking?service=${id}`}
            className={buttonClasses("secondary", "md", true, "mt-7")}
          >
            Book now
          </Link>
        ) : null}
      </div>
    </article>
  );
}
