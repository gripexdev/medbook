import Image from "next/image";
import type { Testimonial } from "@/lib/types";

export default function TestimonialCard({ name, role, quote, avatar }: Testimonial) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200/70 bg-white p-6 transition duration-300 hover:border-brand-200 hover:shadow-soft">
      <div className="flex gap-1 text-amber-400">
        {Array.from({ length: 5 }).map((_, index) => (
          <svg key={index} viewBox="0 0 20 20" className="h-4 w-4 fill-current">
            <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.08l-4.94 2.62.94-5.49-4-3.9 5.53-.8L10 1.5z" />
          </svg>
        ))}
      </div>
      <p className="mt-4 flex-1 text-[15px] leading-relaxed text-slate-600">"{quote}"</p>
      <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
        <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-slate-100">
          <Image src={avatar} alt={name} fill className="object-cover" sizes="40px" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{name}</p>
          <p className="text-xs text-slate-500">{role}</p>
        </div>
      </div>
    </article>
  );
}
