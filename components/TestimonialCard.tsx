import Image from "next/image";
import type { Testimonial } from "@/lib/types";

export default function TestimonialCard({ name, role, quote, avatar }: Testimonial) {
  return (
    <article className="card flex h-full flex-col p-5">
      <div className="flex gap-0.5 text-jira-warning">
        {Array.from({ length: 5 }).map((_, index) => (
          <svg key={index} viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current">
            <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.08l-4.94 2.62.94-5.49-4-3.9 5.53-.8L10 1.5z" />
          </svg>
        ))}
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-jira-text-secondary">"{quote}"</p>
      <div className="mt-4 flex items-center gap-3 border-t border-jira-border pt-4">
        <div className="relative h-8 w-8 overflow-hidden rounded-full">
          <Image src={avatar} alt={name} fill className="object-cover" sizes="32px" />
        </div>
        <div>
          <p className="text-sm font-semibold text-jira-text-primary">{name}</p>
          <p className="text-[11px] text-jira-text-secondary">{role}</p>
        </div>
      </div>
    </article>
  );
}
