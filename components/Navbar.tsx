import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { buttonClasses } from "@/components/Button";
import SignOutButton from "@/components/SignOutButton";
import { getSessionUser } from "@/lib/auth";
import { siteConfig } from "@/config/site";

function getUserInitials(name: string, email: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length > 0) {
    return parts.map((part) => part[0]?.toUpperCase() || "").join("");
  }

  return email.trim().charAt(0).toUpperCase() || "U";
}

function getUserPrimaryLabel(name: string, email: string) {
  const firstName = name.trim().split(/\s+/).filter(Boolean)[0];
  return firstName || email.trim().split("@")[0] || "Account";
}

export default async function Navbar() {
  const user = await getSessionUser();
  const userInitials = user ? getUserInitials(user.name, user.email) : "";
  const userPrimaryLabel = user ? getUserPrimaryLabel(user.name, user.email) : "";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-xl">
      <div className="section-shell py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-slate-900 transition hover:opacity-90">
            <BrandLogo
              className="min-w-0"
              showSubtitle={false}
              markClassName="h-9 w-9 sm:h-10 sm:w-10"
              titleClassName="font-display text-[22px] leading-none tracking-[-0.05em] text-slate-950 sm:text-[24px]"
            />
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-slate-200/70 bg-slate-50/80 px-1.5 py-1.5 text-sm md:flex">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-1.5 text-slate-600 transition hover:bg-white hover:text-slate-950 hover:shadow-sm"
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <Link href="/dashboard" className="rounded-full px-4 py-1.5 text-slate-600 transition hover:bg-white hover:text-slate-950 hover:shadow-sm">
                Dashboard
              </Link>
            ) : null}
            {user?.role === "admin" ? (
              <Link href="/admin" className="rounded-full px-4 py-1.5 text-slate-600 transition hover:bg-white hover:text-slate-950 hover:shadow-sm">
                Admin
              </Link>
            ) : null}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="group flex items-center gap-2.5 rounded-full border border-slate-200/70 bg-white px-2.5 py-1.5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    {userInitials}
                  </span>
                  <span className="pr-1 text-sm font-medium text-slate-700">{userPrimaryLabel}</span>
                </Link>
                <Link href="/booking" className={buttonClasses("primary", "sm")}>
                  Book Now
                </Link>
                <SignOutButton variant="ghost" size="sm" />
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">
                  Sign In
                </Link>
                <Link href="/booking" className={buttonClasses("primary", "sm")}>
                  Book Now
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <Link href={user ? "/booking" : "/login"} className={buttonClasses("primary", "sm", false, "min-w-[104px]")}>
              {user ? "Book Now" : "Sign In"}
            </Link>
          </div>
        </div>

        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 md:hidden">
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={buttonClasses(
                "ghost",
                "sm",
                false,
                "whitespace-nowrap rounded-full border border-transparent"
              )}
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <Link
              href="/dashboard"
              className={buttonClasses(
                "ghost",
                "sm",
                false,
                "whitespace-nowrap rounded-full border border-transparent"
              )}
            >
              Dashboard
            </Link>
          ) : null}
          {user?.role === "admin" ? (
            <Link
              href="/admin"
              className={buttonClasses(
                "ghost",
                "sm",
                false,
                "whitespace-nowrap rounded-full border border-transparent"
              )}
            >
              Admin
            </Link>
          ) : !user ? (
            <Link
              href="/register"
              className={buttonClasses(
                "ghost",
                "sm",
                false,
                "whitespace-nowrap rounded-full border border-transparent"
              )}
            >
              Create account
            </Link>
          ) : (
            <></>
          )}
        </nav>

        {user ? (
          <div className="mt-3 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm md:hidden">
            <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                {userInitials}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900">{userPrimaryLabel}</p>
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                  {user.role === "admin" ? "Admin" : "Account"}
                </p>
              </div>
            </Link>
            <SignOutButton variant="ghost" size="sm" />
          </div>
        ) : null}
      </div>
    </header>
  );
}
