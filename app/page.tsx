import Image from "next/image";
import Link from "next/link";
import { buttonClasses } from "@/components/Button";
import ServiceCard from "@/components/ServiceCard";
import TestimonialCard from "@/components/TestimonialCard";
import { siteConfig } from "@/config/site";

const stepIcons = [
  <svg key="s1" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M8 2v4M16 2v4M3 10h18" strokeLinecap="round" /></svg>,
  <svg key="s2" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  <svg key="s3" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12.5 9.5 17 19 7.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
];

const trustIcons = [
  <svg key="t1" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3l7.5 4v5c0 4.5-3.2 8.7-7.5 10-4.3-1.3-7.5-5.5-7.5-10V7L12 3z" /><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  <svg key="t2" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 7l9 6 9-6" strokeLinecap="round" /></svg>,
  <svg key="t3" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  <svg key="t4" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3a6 6 0 0 1 6 6c0 3 1.5 5 2 6H4c.5-1 2-3 2-6a6 6 0 0 1 6-6zM10 21a2.5 2.5 0 0 0 4 0" strokeLinecap="round" /></svg>
];

export default function HomePage() {
  const featuredServices = siteConfig.services.slice(0, 4);

  return (
    <div className="page-container space-y-8">
      {/* Hero Banner */}
      <div className="card overflow-hidden">
        <div className="flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-center lg:gap-12">
          <div className="flex-1">
            <span className="badge bg-brand-50 text-brand-500">
              Now accepting new patients
            </span>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-jira-text-primary sm:text-3xl lg:text-4xl">
              Healthcare scheduling,<br />
              <span className="text-brand-500">simplified.</span>
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-jira-text-secondary">
              {siteConfig.heroDescription}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/booking" className={buttonClasses("primary", "lg")}>
                Book an Appointment
              </Link>
              <Link href="/#services" className={buttonClasses("secondary", "lg")}>
                View Services
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-6">
              {siteConfig.heroStats.map((item) => (
                <div key={item.label}>
                  <p className="text-xl font-semibold tracking-tight text-jira-text-primary">{item.value}</p>
                  <p className="text-xs text-jira-text-secondary">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:w-[420px]">
            <div className="overflow-hidden rounded-lg border border-jira-border shadow-md">
              <div className="relative aspect-[4/3]">
                <Image
                  src={siteConfig.heroImage}
                  alt="MEDBOOK scheduling interface"
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width: 1024px) 420px, 100vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {siteConfig.trustBadges.map((badge, index) => (
          <div key={badge.title} className="card p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-50 text-brand-500">
              {trustIcons[index]}
            </div>
            <h3 className="mt-3 text-sm font-semibold text-jira-text-primary">{badge.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-jira-text-secondary">{badge.description}</p>
          </div>
        ))}
      </div>

      {/* Services */}
      <section id="services">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="label">Our Services</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-jira-text-primary">
              Expert care tailored to your needs
            </h2>
          </div>
          <Link href="/services" className={buttonClasses("secondary", "sm")}>
            View all services
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {featuredServices.map((service) => (
            <ServiceCard key={service.id} {...service} compact />
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="card p-6 sm:p-8">
        <div className="text-center">
          <p className="label">How it works</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-jira-text-primary">
            Book your appointment in 3 simple steps
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-jira-text-secondary">
            No phone calls, no waiting on hold. Schedule your visit in under a minute.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {siteConfig.steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-lg border border-jira-border bg-jira-bg p-5 transition hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-50 text-brand-500">
                  {stepIcons[index]}
                </div>
                <span className="text-xs font-bold uppercase text-brand-500">Step {index + 1}</span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-jira-text-primary">{step.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-jira-text-secondary">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <div className="text-center">
          <p className="label">Patient Reviews</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-jira-text-primary">
            Trusted by 2,400+ patients
          </h2>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {siteConfig.testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="overflow-hidden rounded-lg bg-brand-600 p-6 text-white shadow-md sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand-200">
              Ready to get started?
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
              Your health shouldn't wait. Book today.
            </h2>
            <p className="mt-2 max-w-lg text-sm text-brand-100">
              Join thousands of patients who trust MEDBOOK for fast, reliable appointment scheduling.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/booking" className="inline-flex items-center justify-center gap-2 rounded bg-white px-5 py-2.5 text-sm font-medium text-brand-600 shadow-sm transition hover:bg-brand-50">
              Book an Appointment
            </Link>
            <Link href="/#contact" className="inline-flex items-center justify-center gap-2 rounded border border-white/30 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <p className="label">Get in Touch</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-jira-text-primary">
            We're here to help
          </h2>
          <p className="mt-2 text-sm text-jira-text-secondary">
            Have questions about our services or need help scheduling? Reach out and our team will get back to you within the hour.
          </p>

          <div className="mt-6 space-y-3">
            {[
              { label: "Email", value: siteConfig.contact.email },
              { label: "Phone", value: siteConfig.contact.phone },
              { label: "Address", value: siteConfig.contact.address }
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-md border border-jira-border bg-jira-bg px-4 py-3">
                <span className="text-xs font-semibold uppercase text-jira-text-secondary">{item.label}</span>
                <span className="text-sm text-jira-text-primary">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-md border border-jira-border bg-jira-bg px-4 py-3">
            <p className="text-xs font-semibold uppercase text-jira-text-secondary">Office Hours</p>
            <div className="mt-2 space-y-1">
              {siteConfig.hours.map((h) => (
                <p key={h} className="text-sm text-jira-text-primary">{h}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="card overflow-hidden p-3">
          <div className="relative aspect-[6/5] overflow-hidden rounded-md border border-jira-border">
            <Image
              src="/images/services/signature-care.svg"
              alt="MEDBOOK clinic"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="divider pt-6 pb-2">
        <div className="flex flex-col gap-4 text-xs text-jira-text-secondary sm:flex-row sm:items-center sm:justify-between">
          <p>{new Date().getFullYear()} MEDBOOK. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-jira-text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-jira-text-primary">Terms of Service</Link>
            <Link href="#" className="hover:text-jira-text-primary">HIPAA Notice</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
