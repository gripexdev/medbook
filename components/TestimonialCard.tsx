import Image from "next/image";
import type { Testimonial } from "@/lib/types";

export default function TestimonialCard({ name, role, quote, avatar }: Testimonial) {
  return (
    <article className="panel hover-lift h-full p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="relative h-14 w-14 overflow-hidden rounded-full ring-4 ring-white">
          <Image src={avatar} alt={name} fill className="object-cover" sizes="56px" />
        </div>
        <div>
          <p className="font-semibold text-slate-900">{name}</p>
          <p className="text-sm text-slate-500">{role}</p>
        </div>
      </div>
      <div className="mt-5 flex gap-1 text-brand-500">
        {Array.from({ length: 5 }).map((_, index) => (
          <svg key={index} viewBox="0 0 24 24" className="h-4 w-4 fill-current">
            <path d="M12 2.8 14.82 8.5l6.28.92-4.55 4.43 1.08 6.25L12 17.14 6.37 20.1l1.08-6.25L2.9 9.42l6.28-.92L12 2.8Z" />
          </svg>
        ))}
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-[15px]">"{quote}"</p>
    </article>
  );
}
