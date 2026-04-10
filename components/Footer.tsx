import Link from "next/link";
import { BrandMark } from "@/components/BrandLogo";
import { siteConfig } from "@/config/site";

function SocialIcon({ label }: { label: string }) {
  if (label === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (label === "LinkedIn") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M6.5 8.2A1.7 1.7 0 1 0 6.5 4.8a1.7 1.7 0 0 0 0 3.4ZM5 9.7h3v9.2H5zm4.9 0h2.9V11c.5-.9 1.5-1.6 3-1.6 2.4 0 3.2 1.5 3.2 4.1v5.4h-3v-4.9c0-1.2-.2-2.1-1.5-2.1-1.2 0-1.8.9-1.8 2.1v4.9h-3z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12 3.5c-4.8 0-8.5 3.7-8.5 8.5s3.7 8.5 8.5 8.5 8.5-3.7 8.5-8.5S16.8 3.5 12 3.5Zm-1.8 4.3h3.4c2.6 0 4.1 1.3 4.1 3.4 0 2.4-1.8 3.7-4.2 3.7H12v2.7h-1.8V7.8Zm1.8 5.6h1.3c1.5 0 2.6-.5 2.6-2 0-1.2-.9-1.9-2.3-1.9H12v3.9Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200/60 bg-white">
      <div className="section-shell py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <BrandMark className="h-9 w-9" />
              <span className="font-display text-xl font-semibold tracking-[-0.04em] text-slate-950">
                {siteConfig.name}
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              {siteConfig.description}
            </p>
            <div className="mt-5 flex gap-2">
              {siteConfig.socialLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/70 bg-slate-50 text-slate-500 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-600"
                  aria-label={item.label}
                >
                  <SocialIcon label={item.label} />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Navigation</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {siteConfig.navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-slate-600 transition hover:text-slate-900">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services" className="text-slate-600 transition hover:text-slate-900">
                  All Services
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">For Patients</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/booking" className="text-slate-600 transition hover:text-slate-900">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-slate-600 transition hover:text-slate-900">
                  Patient Portal
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-slate-600 transition hover:text-slate-900">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-slate-600 transition hover:text-slate-900">
                  My Appointments
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Contact</p>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
              <li>{siteConfig.contact.email}</li>
              <li>{siteConfig.contact.phone}</li>
              <li>{siteConfig.contact.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-200/60 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>{new Date().getFullYear()} MEDBOOK. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="transition hover:text-slate-600">Privacy Policy</Link>
            <Link href="#" className="transition hover:text-slate-600">Terms of Service</Link>
            <Link href="#" className="transition hover:text-slate-600">HIPAA Notice</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
