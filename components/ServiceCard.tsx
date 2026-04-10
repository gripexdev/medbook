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
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white transition duration-300 hover:border-brand-200 hover:shadow-soft">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-slate-100/90 bg-slate-50">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 44vw, 100vw"
        />
        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700 shadow-sm backdrop-blur">
            {category}
          </span>
        </div>
      </div>
      <div className="flex h-full flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="10" cy="10" r="7" />
              <path d="M10 6.5v3.5l2.5 1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {duration}
          </div>
          <span className="font-display text-lg font-semibold text-slate-950">{price}</span>
        </div>
        <h3 className="mt-4 font-display text-[20px] font-semibold leading-tight tracking-[-0.02em] text-slate-950 sm:text-[22px]">
          {name}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>
        {!compact ? (
          <Link
            href={`/booking?service=${id}`}
            className={buttonClasses("primary", "md", true, "mt-6")}
          >
            Book this service
          </Link>
        ) : (
          <Link
            href={`/booking?service=${id}`}
            className="mt-auto pt-5 flex items-center gap-1 text-sm font-semibold text-brand-600 transition hover:text-brand-700 hover:gap-2"
          >
            Book now
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor"><path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L11.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 1 1-1.04-1.08l3.158-2.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" /></svg>
          </Link>
        )}
      </div>
    </article>
  );
}
