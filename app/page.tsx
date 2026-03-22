import Image from "next/image";
import Link from "next/link";
import { buttonClasses } from "@/components/Button";
import PageIntro from "@/components/PageIntro";
import SectionShell from "@/components/SectionShell";
import ServiceCard from "@/components/ServiceCard";
import TestimonialCard from "@/components/TestimonialCard";
import { siteConfig } from "@/config/site";

const stepIcons = [
  (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9">
      <rect x="4" y="5" width="16" height="15" rx="3" />
      <path d="M8 3v4M16 3v4M7 11h10M7 15h6" strokeLinecap="round" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M5 12.5 9.5 17 19 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
    </svg>
  )
];

export default function HomePage() {
  const featuredServices = siteConfig.services.slice(0, 4);

  return (
    <div className="pb-20 md:pb-24">
      <SectionShell className="pt-8 md:pt-14">
        <div className="hero-grid panel relative overflow-hidden px-5 py-6 sm:px-8 sm:py-10 md:px-10 md:py-12">
          <div className="absolute -left-12 top-8 hidden h-44 w-44 rounded-full bg-brand-100/80 blur-2xl sm:block sm:h-56 sm:w-56 sm:blur-3xl" />
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-cyan-100/70 blur-2xl sm:h-72 sm:w-72 sm:blur-3xl" />
          <div className="absolute bottom-0 left-1/2 hidden h-52 w-52 -translate-x-1/2 rounded-full bg-brand-50 blur-3xl sm:block" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-12">
            <div className="reveal-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-brand-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-brand-500" />
                High-trust scheduling
              </span>

              <h1 className="mt-7 max-w-xl font-display text-[38px] font-semibold leading-[0.98] tracking-[-0.05em] text-slate-950 sm:text-[48px] md:text-[68px]">
                Book appointments with the clarity of a world-class product.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 md:text-[17px]">
                {siteConfig.heroDescription}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href="/booking" className={buttonClasses("primary", "lg", false, "w-full sm:w-auto")}>
                  Book Now
                </Link>
                <Link href="/#services" className={buttonClasses("secondary", "lg", false, "w-full sm:w-auto")}>
                  Explore Services
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {siteConfig.heroStats.map((item, index) => (
                  <div
                    key={item.label}
                    className={`panel-muted rounded-[26px] px-5 py-5 reveal-up reveal-delay-${index + 1}`}
                  >
                    <p className="font-display text-[28px] font-semibold leading-none tracking-[-0.04em] text-slate-950 sm:text-[30px]">
                      {item.value}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-2 lg:mt-0">
              <div className="absolute inset-x-10 top-10 hidden h-64 rounded-full bg-brand-200/70 blur-3xl sm:block" />
              <div className="product-shell relative overflow-hidden rounded-[30px] border border-white/90 p-3 shadow-lift reveal-up reveal-delay-2 sm:rounded-[36px] sm:p-4">
                <div className="relative aspect-[4/4.2] overflow-hidden rounded-[24px] border border-slate-200/80 bg-white sm:aspect-[16/12] sm:rounded-[28px]">
                  <Image
                    src={siteConfig.heroImage}
                    alt="MEDBOOK product interface"
                    fill
                    priority
                    className="object-cover"
                    sizes="(min-width: 1024px) 54vw, 100vw"
                  />
                </div>

                <div className="pointer-events-none absolute left-7 top-7 hidden rounded-[24px] border border-slate-200 bg-white/95 px-5 py-4 shadow-soft sm:block">
                  <p className="text-xs uppercase tracking-[0.26em] text-slate-400">This week</p>
                  <p className="mt-2 font-display text-[30px] font-semibold leading-none tracking-[-0.04em] text-slate-950">
                    128 bookings
                  </p>
                  <p className="mt-2 text-sm text-slate-500">Across 4 services</p>
                </div>

                <div className="pointer-events-none absolute bottom-7 left-7 hidden max-w-[260px] rounded-[24px] bg-slate-950 px-5 py-5 text-white shadow-lift md:block">
                  <p className="text-xs uppercase tracking-[0.26em] text-white/45">Next confirmed</p>
                  <p className="mt-3 font-display text-[28px] font-semibold leading-none tracking-[-0.04em]">
                    11:30 AM
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/70">
                    Executive Priority Visit with automated confirmation already sent.
                  </p>
                </div>

                <div className="pointer-events-none absolute bottom-7 right-7 hidden rounded-[24px] border border-white/80 bg-white/95 px-5 py-5 shadow-soft md:block">
                  <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Conversion</p>
                  <p className="mt-2 font-display text-[28px] font-semibold leading-none tracking-[-0.04em] text-slate-950">
                    +22%
                  </p>
                  <p className="mt-2 text-sm text-slate-500">More visitors completing a booking</p>
                </div>

                <div className="mt-4 grid gap-3 sm:hidden">
                  <div className="rounded-[24px] border border-slate-200 bg-white/95 px-4 py-4 shadow-soft">
                    <p className="text-xs uppercase tracking-[0.26em] text-slate-400">This week</p>
                    <p className="mt-2 font-display text-[28px] font-semibold leading-none tracking-[-0.04em] text-slate-950">
                      128 bookings
                    </p>
                    <p className="mt-2 text-sm text-slate-500">Across 4 services</p>
                  </div>
                  <div className="grid gap-3">
                    <div className="rounded-[24px] bg-slate-950 px-4 py-4 text-white shadow-soft">
                      <p className="text-xs uppercase tracking-[0.26em] text-white/45">Next confirmed</p>
                      <p className="mt-2 font-display text-[24px] font-semibold leading-none tracking-[-0.04em]">
                        11:30 AM
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/70">Executive Priority Visit.</p>
                    </div>
                    <div className="rounded-[24px] border border-slate-200 bg-white/95 px-4 py-4 shadow-soft">
                      <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Conversion</p>
                      <p className="mt-2 font-display text-[24px] font-semibold leading-none tracking-[-0.04em] text-slate-950">
                        +22%
                      </p>
                      <p className="mt-2 text-sm text-slate-500">More visitors booking.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell id="services" className="pt-20 md:pt-24">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <PageIntro
            eyebrow="Services"
            title="Clean service presentation, built for trust"
            description="A grid that feels closer to a polished SaaS surface than a generic service list, with consistent imagery, pricing, and clear next actions."
          />
          <Link href="/services" className={buttonClasses("secondary", "sm")}>
            See all services
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredServices.map((service) => (
            <ServiceCard key={service.id} {...service} compact />
          ))}
        </div>
      </SectionShell>

      <SectionShell className="pt-20 md:pt-24">
        <div className="panel overflow-hidden px-5 py-6 sm:px-8 sm:py-10 md:px-10">
          <PageIntro
            eyebrow="How it works"
            title="Three steps, with no friction in the middle"
            description="The flow stays simple, but the presentation feels intentional and product-grade."
            centered
          />

          <div className="relative mt-12">
            <div className="absolute left-[12%] right-[12%] top-7 hidden h-px bg-slate-200 lg:block" />
            <div className="grid gap-6 lg:grid-cols-3">
              {siteConfig.steps.map((step, index) => (
                <article
                  key={step.title}
                  className="relative rounded-[28px] border border-slate-200 bg-slate-50/90 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-soft"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm">
                    {stepIcons[index]}
                  </div>
                  <p className="mt-6 text-xs uppercase tracking-[0.26em] text-slate-400">
                    Step 0{index + 1}
                  </p>
                  <h3 className="mt-3 font-display text-[24px] font-semibold leading-tight tracking-[-0.03em] text-slate-950 sm:text-[28px]">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell className="pt-20 md:pt-24">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div>
            <PageIntro
              eyebrow="Testimonials"
              title="The kind of product polish clients notice immediately"
              description="Sharper spacing, cleaner type, and stronger visuals make the experience feel credible before anyone even clicks the CTA."
            />
            <div className="panel-muted mt-8 p-6">
              <p className="text-sm leading-7 text-slate-600">
                MEDBOOK is designed to resemble the level of finish people expect from modern product companies: minimal, bright, and precise.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {siteConfig.testimonials.map((testimonial, index) => (
              <div key={testimonial.name} className={index === 0 ? "md:col-span-2 xl:col-span-1" : ""}>
                <TestimonialCard {...testimonial} />
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell className="pt-20 md:pt-24">
        <div className="relative overflow-hidden rounded-[30px] bg-slate-950 px-5 py-8 text-white shadow-lift sm:px-8 sm:py-10 md:rounded-[36px] md:px-12 md:py-12">
          <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Get started</p>
              <h2 className="mt-5 font-display text-[34px] font-semibold leading-[1.02] tracking-[-0.05em] sm:text-[42px] md:text-[58px]">
                Ready to book your appointment?
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-white/70">
                Bring the same level of clarity and confidence to your booking experience that users expect from top-tier digital products.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              <Link href="/booking" className={buttonClasses("primary", "lg", false, "w-full sm:w-auto")}>
                Get Started
              </Link>
              <Link href="/#contact" className={buttonClasses("secondary", "lg", false, "w-full sm:w-auto")}>
                Contact sales
              </Link>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell id="contact" className="pt-20 md:pt-24">
        <div className="grid gap-6 lg:grid-cols-[0.96fr_1.04fr]">
          <div className="panel p-6 sm:p-8 md:p-10">
            <PageIntro
              eyebrow="Contact"
              title="Designed to feel ready for a real client handoff"
              description="Use the final section to surface practical contact details without losing the clean, product-forward tone."
            />

            <div className="mt-8 grid gap-4">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-5">
                <p className="text-sm font-semibold text-slate-950">Email</p>
                <p className="mt-2 break-all text-sm leading-7 text-slate-600">{siteConfig.contact.email}</p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-5">
                <p className="text-sm font-semibold text-slate-950">Phone</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{siteConfig.contact.phone}</p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-5">
                <p className="text-sm font-semibold text-slate-950">Address</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{siteConfig.contact.address}</p>
              </div>
            </div>
          </div>

          <div className="panel overflow-hidden p-3 sm:p-4">
            <div className="product-shell relative overflow-hidden rounded-[26px] border border-slate-200 sm:rounded-[30px]">
              <div className="relative aspect-[4/5] sm:aspect-[6/5]">
                <Image
                  src="/images/services/signature-care.svg"
                  alt="MEDBOOK product experience"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 52vw, 100vw"
                />
              </div>
              <div className="absolute left-6 top-6 hidden rounded-[24px] border border-white/90 bg-white/95 px-5 py-4 shadow-soft sm:block">
                <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Support window</p>
                <p className="mt-2 font-display text-[28px] font-semibold leading-none tracking-[-0.04em] text-slate-950">
                  Same-day replies
                </p>
              </div>
              <div className="absolute inset-x-6 bottom-6 hidden rounded-[26px] bg-white/95 px-6 py-5 shadow-soft backdrop-blur md:block">
                <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Clinic hours</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {siteConfig.hours.map((item) => (
                    <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-3 p-4 md:hidden">
                <div className="rounded-[24px] border border-white/90 bg-white/95 px-5 py-4 shadow-soft">
                  <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Support window</p>
                  <p className="mt-2 font-display text-[26px] font-semibold leading-none tracking-[-0.04em] text-slate-950">
                    Same-day replies
                  </p>
                </div>
                <div className="rounded-[24px] bg-white/95 px-5 py-5 shadow-soft">
                  <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Clinic hours</p>
                  <div className="mt-4 grid gap-3">
                    {siteConfig.hours.map((item) => (
                      <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionShell>
    </div>
  );
}
