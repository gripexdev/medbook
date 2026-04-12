import Link from "next/link";
import { BrandMark } from "@/components/BrandLogo";
import { getSessionUser } from "@/lib/auth";
import { siteConfig } from "@/config/site";

function NavIcon({ type }: { type: string }) {
  const cls = "h-5 w-5 shrink-0";
  switch (type) {
    case "home":
      return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 10.5L12 3l9 7.5V21a1.5 1.5 0 0 1-1.5 1.5h-4.125a1.5 1.5 0 0 1-1.5-1.5v-4.5h-3.75V21a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 21V10.5z" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    case "services":
      return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>;
    case "booking":
      return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M8 2v4M16 2v4M3 10h18" strokeLinecap="round" /></svg>;
    case "dashboard":
      return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5zM14 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5zM4 15a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4zM14 12a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-7z" /></svg>;
    case "admin":
      return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
    case "contact":
      return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
    default:
      return null;
  }
}

const navItems = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Services", href: "/services", icon: "services" },
  { label: "Book Appointment", href: "/booking", icon: "booking" },
  { label: "Contact", href: "/#contact", icon: "contact" }
];

const authNavItems = [
  { label: "My Appointments", href: "/dashboard", icon: "dashboard" }
];

const adminNavItems = [
  { label: "Admin Panel", href: "/admin", icon: "admin" }
];

export default async function Sidebar() {
  const user = await getSessionUser();

  return (
    <aside className="hidden w-sidebar shrink-0 flex-col bg-brand-500 text-white md:flex">
      {/* Logo */}
      <div className="flex h-topbar items-center gap-2.5 border-b border-white/10 px-5">
        <BrandMark className="h-8 w-8" />
        <span className="text-[17px] font-semibold tracking-tight text-white">
          {siteConfig.name}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <NavIcon type={item.icon} />
              {item.label}
            </Link>
          ))}
        </div>

        {user ? (
          <>
            <div className="my-4 border-t border-white/10" />
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
              Your Account
            </p>
            <div className="space-y-0.5">
              {authNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  <NavIcon type={item.icon} />
                  {item.label}
                </Link>
              ))}
            </div>
          </>
        ) : null}

        {user?.role === "admin" ? (
          <>
            <div className="my-4 border-t border-white/10" />
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
              Administration
            </p>
            <div className="space-y-0.5">
              {adminNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  <NavIcon type={item.icon} />
                  {item.label}
                </Link>
              ))}
            </div>
          </>
        ) : null}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-white/10 px-3 py-4">
        <div className="rounded-md bg-white/10 px-3 py-3">
          <p className="text-xs font-semibold text-white/90">Need help?</p>
          <p className="mt-1 text-[11px] leading-relaxed text-white/50">
            {siteConfig.contact.phone}
          </p>
          <p className="text-[11px] leading-relaxed text-white/50">
            {siteConfig.contact.email}
          </p>
        </div>
      </div>
    </aside>
  );
}
