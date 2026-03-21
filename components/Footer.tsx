import Link from "next/link";
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
    <footer className="border-t border-slate-200/80 bg-white/80">
      <div className="section-shell py-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-semibold text-white shadow-soft">
                MB
              </span>
              <p className="font-display text-3xl leading-none tracking-[-0.03em] text-slate-950">{siteConfig.name}</p>
            </div>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">{siteConfig.description}</p>
            <div className="mt-6 flex gap-3">
              {siteConfig.socialLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-brand-200 hover:text-brand-700"
                  aria-label={item.label}
                >
                  <SocialIcon label={item.label} />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Navigation</p>
            <ul className="mt-5 space-y-3 text-sm text-slate-600">
              {siteConfig.navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-slate-900">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Contact</p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
              <li>{siteConfig.contact.email}</li>
              <li>{siteConfig.contact.phone}</li>
              <li>{siteConfig.contact.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-stone-200 pt-6 text-xs uppercase tracking-[0.24em] text-slate-400">
          {new Date().getFullYear()} MEDBOOK. Designed as a premium booking concept.
        </div>
      </div>
    </footer>
  );
}
