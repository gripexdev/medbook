import Link from "next/link";
import { BrandMark } from "@/components/BrandLogo";
import { buttonClasses } from "@/components/Button";
import SignOutButton from "@/components/SignOutButton";
import { getSessionUser } from "@/lib/auth";
import { siteConfig } from "@/config/site";

function getUserInitials(name: string, email: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  if (parts.length > 0) return parts.map((p) => p[0]?.toUpperCase() || "").join("");
  return email.trim().charAt(0).toUpperCase() || "U";
}

function getUserPrimaryLabel(name: string, email: string) {
  const firstName = name.trim().split(/\s+/).filter(Boolean)[0];
  return firstName || email.trim().split("@")[0] || "Account";
}

export default async function TopBar() {
  const user = await getSessionUser();
  const userInitials = user ? getUserInitials(user.name, user.email) : "";
  const userPrimaryLabel = user ? getUserPrimaryLabel(user.name, user.email) : "";

  return (
    <header className="flex h-topbar shrink-0 items-center justify-between border-b border-jira-border bg-white px-4 sm:px-6">
      {/* Mobile logo */}
      <div className="flex items-center gap-2 md:hidden">
        <BrandMark className="h-7 w-7" />
        <span className="text-[15px] font-semibold tracking-tight text-jira-text-primary">
          {siteConfig.name}
        </span>
      </div>

      {/* Breadcrumb / page context on desktop */}
      <div className="hidden items-center gap-2 text-sm md:flex">
        <Link href="/" className="text-jira-text-secondary transition hover:text-jira-text-primary">
          {siteConfig.name}
        </Link>
        <span className="text-jira-text-secondary">/</span>
        <span className="font-medium text-jira-text-primary">Dashboard</span>
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center gap-1 overflow-x-auto text-sm md:hidden">
        <Link href="/" className="rounded px-2 py-1 text-xs font-medium text-jira-text-secondary hover:bg-jira-hover hover:text-jira-text-primary">Home</Link>
        <Link href="/services" className="rounded px-2 py-1 text-xs font-medium text-jira-text-secondary hover:bg-jira-hover hover:text-jira-text-primary">Services</Link>
        <Link href="/#contact" className="rounded px-2 py-1 text-xs font-medium text-jira-text-secondary hover:bg-jira-hover hover:text-jira-text-primary">Contact</Link>
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {user ? (
          <>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-md px-2 py-1.5 transition hover:bg-jira-hover"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-[11px] font-bold text-white">
                {userInitials}
              </span>
              <span className="hidden text-sm font-medium text-jira-text-primary sm:inline">
                {userPrimaryLabel}
              </span>
            </Link>
            <Link href="/booking" className={buttonClasses("primary", "sm")}>
              Book Now
            </Link>
            <SignOutButton variant="ghost" size="sm" />
          </>
        ) : (
          <>
            <Link href="/login" className="hidden text-sm font-medium text-jira-text-secondary transition hover:text-jira-text-primary sm:inline">
              Sign In
            </Link>
            <Link href="/booking" className={buttonClasses("primary", "sm")}>
              Book Now
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
