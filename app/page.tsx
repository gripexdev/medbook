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
    <svg key="step-1" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9">
      <rect x="4" y="5" width="16" height="15" rx="3" />
      <path d="M8 3v4M16 3v4M7 11h10M7 15h6" strokeLinecap="round" />
    </svg>
  ),
  (
    <svg key="step-2" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  (
    <svg key="step-3" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M5 12.5 9.5 17 19 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
    </svg>
  )
];

const trustIcons = [
  <svg key="shield" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3l7.5 4v5c0 4.5-3.2 8.7-7.5 10-4.3-1.3-7.5-5.5-7.5-10V7L12 3z" /><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  <svg key="mail" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 7l9 6 9-6" strokeLinecap="round" /></svg>,
  <svg key="clock" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  <svg key="bell" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3a6 6 0 0 1 6 6c0 3 1.5 5 2 6H4c.5-1 2-3 2-6a6 6 0 0 1 6-6zM10 21a2.5 2.5 0 0 0 4 0" strokeLinecap="round" /></svg>
];

export default function HomePage() {
  const featuredServices = siteConfig.services.slice(0, 4);

  return (
    <div className="pb-20 md:pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-grid" />
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-brand-200/30 blur-3xl" />
        <div className="absolute -right-40 top-40 h-80 w-80 rounded-full bg-accent-200/20 blur-3xl" />

        <div className="section-shell relative pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div className="reveal-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                <span className="flex h-2 w-2">
                  <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-brand-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
                </span>
                Now accepting new patients
              </span>

              <h1 className="mt-7 max-w-xl font-display text-[36px] font-semibold leading-[1.04] tracking-[-0.04em] text-slate-950 sm:text-[46px] md:text-[60px]">
                Healthcare scheduling,{" "}
                <span className="gradient-text">simplified.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
                {siteConfig.heroDescription}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href="/booking" className={buttonClasses("primary", "lg", false, "w-full sm:w-auto")}>
                  Book an Appointment
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor"><path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L11.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 1 1-1.04-1.08l3.158-2.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" /></svg>
                </Link>
                <Link href="/#services" className={buttonClasses("secondary", "lg", false, "w-full sm:w-auto")}>
                  View Services
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {siteConfig.heroStats.map((item, index) => (
                  <div
                    key={item.label}
                    className={`rounded-2xl border border-slate-200/60 bg-white/80 px-5 py-4 backdrop-blur-sm reveal-up reveal-delay-${index + 1}`}
                  >
                    <p className="font-display text-[26px] font-semibold leading-none tracking-[-0.04em] text-slate-950 sm:text-[28px]">
                      {item.value}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-2 lg:mt-0">
              <div className="absolute inset-x-10 top-10 hidden h-64 rounded-full bg-brand-200/50 blur-3xl sm:block" />
              <div className="product-shell relative overflow-hidden rounded-[30px] border border-white/90 p-3 shadow-lift reveal-up reveal-delay-2 sm:rounded-[36px] sm:p-4">
                <div className="relative aspect-[4/4.2] overflow-hidden rounded-[24px] border border-slate-200/80 bg-white sm:aspect-[16/12] sm:rounded-[28px]">
                  <Image
                    src={siteConfig.heroImage}
                    alt="MEDBOOK scheduling interface"
                    fill
                    priority
                    className="object-cover"
                    sizes="(min-width: 1024px) 54vw, 100vw"
                  />
                </div>

                <div className="pointer-events-none absolute left-7 top-7 hidden rounded-2xl border border-slate-200/80 bg-white/95 px-5 py-4 shadow-soft backdrop-blur sm:block">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">This week</p>
                  <p className="mt-2 font-display text-[28px] font-semibold leading-none tracking-[-0.04em] text-slate-950">
                    128 bookings
                  </p>
                  <p className="mt-2 text-sm text-slate-500">Across 4 services</p>
                </div>

                <div className="pointer-events-none absolute bottom-7 left-7 hidden max-w-[260px] rounded-2xl bg-slate-950 px-5 py-5 text-white shadow-lift md:block">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">Next appointment</p>
                  <p className="mt-3 font-display text-[26px] font-semibold leading-none tracking-[-0.04em]">
                    11:30 AM
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/70">
                    Dr. Sarah Chen - Executive Health Check with automated reminder sent.
                  </p>
                </div>

                <div className="pointer-events-none absolute bottom-7 right-7 hidden rounded-2xl border border-white/80 bg-white/95 px-5 py-4 shadow-soft backdrop-blur md:block">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Patient rating</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="font-display text-[26px] font-semibold leading-none tracking-[-0.04em] text-slate-950">
                      4.9
                    </p>
                    <div className="flex gap-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current">
                          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.08l-4.94 2.62.94-5.49-4-3.9 5.53-.8L10 1.5z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">Based on 240+ reviews</p>
                </div>

                <div className="mt-4 grid gap-3 sm:hidden">
                  <div className="rounded-2xl border border-slate-200 bg-white/95 px-4 py-4 shadow-soft">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">This week</p>
                    <p className="mt-2 font-display text-[26px] font-semibold leading-none tracking-[-0.04em] text-slate-950">
                      128 bookings
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-950 px-4 py-4 text-white shadow-soft">
                      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/45">Next</p>
                      <p className="mt-2 font-display text-[22px] font-semibold leading-none tracking-[-0.04em]">
                        11:30 AM
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white/95 px-4 py-4 shadow-soft">
                      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">Rating</p>
                      <p className="mt-2 font-display text-[22px] font-semibold leading-none tracking-[-0.04em] text-slate-950">
                        4.9/5
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <SectionShell className="pt-16 md:pt-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.trustBadges.map((badge, index) => (
            <div
              key={badge.title}
              className={`group rounded-2xl border border-slate-200/60 bg-white/80 p-6 transition duration-300 hover:border-brand-200 hover:shadow-soft reveal-up reveal-delay-${Math.min(index + 1, 3)}`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-100">
                {trustIcons[index]}
              </div>
              <h3 className="mt-4 text-[15px] font-semibold text-slate-900">{badge.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{badge.description}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      {/* Services */}
      <SectionShell id="services" className="pt-20 md:pt-28">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <PageIntro
            eyebrow="Our Services"
            title="Expert care tailored to your needs"
            description="From initial consultations to executive health checks, find the right appointment for your wellness journey."
          />
          <Link href="/services" className={buttonClasses("secondary", "sm")}>
            View all services
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredServices.map((service) => (
            <ServiceCard key={service.id} {...service} compact />
          ))}
        </div>
      </SectionShell>

      {/* How it Works */}
      <SectionShell className="pt-20 md:pt-28">
        <div className="rounded-[32px] border border-slate-200/60 bg-gradient-to-b from-slate-50/80 to-white px-5 py-10 sm:px-8 sm:py-14 md:px-12">
          <PageIntro
            eyebrow="How it works"
            title="Book your appointment in 3 simple steps"
            description="No phone calls, no waiting on hold. Schedule your visit in under a minute."
            centered
          />

          <div className="relative mt-14">
            <div className="absolute left-[16%] right-[16%] top-7 hidden h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent lg:block" />
            <div className="grid gap-6 lg:grid-cols-3">
              {siteConfig.steps.map((step, index) => (
                <article
                  key={step.title}
                  className="group relative rounded-2xl border border-slate-200/70 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-soft"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-100 group-hover:text-brand-700">
                    {stepIcons[index]}
                  </div>
                  <p className="mt-6 font-display text-sm font-semibold text-brand-500">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-2 font-display text-[22px] font-semibold leading-tight tracking-[-0.03em] text-slate-950 sm:text-[24px]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </SectionShell>

      {/* Testimonials */}
      <SectionShell className="pt-20 md:pt-28">
        <div className="text-center">
          <PageIntro
            eyebrow="Patient Reviews"
            title="Trusted by 2,400+ patients"
            description="See what our patients are saying about their experience with MEDBOOK."
            centered
          />
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {siteConfig.testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </div>
      </SectionShell>

      {/* CTA Section */}
      <SectionShell className="pt-20 md:pt-28">
        <div className="dark-gradient relative overflow-hidden rounded-[32px] px-6 py-12 text-white shadow-lift sm:px-10 sm:py-16 md:px-14 md:py-20">
          <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-brand-300">Ready to get started?</p>
              <h2 className="mt-5 font-display text-[32px] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-[40px] md:text-[52px]">
                Your health shouldn't wait.{" "}
                <span className="text-brand-300">Book today.</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300">
                Join thousands of patients who trust MEDBOOK for fast, reliable appointment scheduling. Real-time availability, instant confirmation, and automated reminders.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap lg:flex-col">
              <Link href="/booking" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-slate-900 shadow-soft transition hover:bg-slate-50 hover:shadow-lift">
                Book an Appointment
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor"><path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L11.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 1 1-1.04-1.08l3.158-2.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" /></svg>
              </Link>
              <Link href="/#contact" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-[15px] font-semibold text-white backdrop-blur transition hover:bg-white/20">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </SectionShell>

      {/* Contact */}
      <SectionShell id="contact" className="pt-20 md:pt-28">
        <div className="grid gap-6 lg:grid-cols-[0.96fr_1.04fr]">
          <div className="rounded-[32px] border border-slate-200/60 bg-white p-6 sm:p-8 md:p-10">
            <PageIntro
              eyebrow="Get in Touch"
              title="We're here to help"
              description="Have questions about our services or need help scheduling? Reach out and our team will get back to you within the hour."
            />

            <div className="mt-8 grid gap-4">
              <div className="group rounded-2xl border border-slate-200/70 bg-slate-50/50 p-5 transition hover:border-brand-200 hover:bg-brand-50/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-100">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 7l9 6 9-6" strokeLinecap="round" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Email</p>
                    <p className="text-sm text-slate-600">{siteConfig.contact.email}</p>
                  </div>
                </div>
              </div>
              <div className="group rounded-2xl border border-slate-200/70 bg-slate-50/50 p-5 transition hover:border-brand-200 hover:bg-brand-50/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-100">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Phone</p>
                    <p className="text-sm text-slate-600">{siteConfig.contact.phone}</p>
                  </div>
                </div>
              </div>
              <div className="group rounded-2xl border border-slate-200/70 bg-slate-50/50 p-5 transition hover:border-brand-200 hover:bg-brand-50/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-100">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Address</p>
                    <p className="text-sm text-slate-600">{siteConfig.contact.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-brand-50/50 p-5">
              <p className="text-sm font-semibold text-slate-900">Office Hours</p>
              <div className="mt-3 grid gap-2">
                {siteConfig.hours.map((item) => (
                  <p key={item} className="text-sm text-slate-600">{item}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200/60 bg-white overflow-hidden p-3 sm:p-4">
            <div className="relative overflow-hidden rounded-[26px] border border-slate-200/80 sm:rounded-[28px]">
              <div className="relative aspect-[4/5] sm:aspect-[6/5]">
                <Image
                  src="/images/services/signature-care.svg"
                  alt="MEDBOOK clinic"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 52vw, 100vw"
                />
              </div>
              <div className="absolute left-6 top-6 hidden rounded-2xl border border-white/90 bg-white/95 px-5 py-4 shadow-soft backdrop-blur sm:block">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Response time</p>
                <p className="mt-2 font-display text-[26px] font-semibold leading-none tracking-[-0.04em] text-slate-950">
                  Under 1 hour
                </p>
              </div>
              <div className="absolute inset-x-6 bottom-6 hidden rounded-2xl bg-white/95 px-6 py-5 shadow-soft backdrop-blur md:block">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Clinic hours</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {siteConfig.hours.map((item) => (
                    <div key={item} className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-3 p-4 md:hidden">
                <div className="rounded-2xl border border-white/90 bg-white/95 px-5 py-4 shadow-soft">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Response time</p>
                  <p className="mt-2 font-display text-[24px] font-semibold leading-none tracking-[-0.04em] text-slate-950">
                    Under 1 hour
                  </p>
                </div>
                <div className="rounded-2xl bg-white/95 px-5 py-5 shadow-soft">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Clinic hours</p>
                  <div className="mt-4 grid gap-3">
                    {siteConfig.hours.map((item) => (
                      <div key={item} className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
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
