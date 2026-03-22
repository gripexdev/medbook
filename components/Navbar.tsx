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
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="section-shell py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="text-slate-900 transition hover:opacity-90">
            <BrandLogo
              className="min-w-0"
              markClassName="h-10 w-10 sm:h-11 sm:w-11"
              titleClassName="font-display text-[24px] leading-none tracking-[-0.05em] text-slate-950 sm:text-[28px]"
              subtitleClassName="mt-1 hidden text-[11px] uppercase tracking-[0.28em] text-slate-400 md:block"
            />
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            {siteConfig.navigation.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-slate-950">
                {item.label}
              </Link>
            ))}
            {user ? (
              <Link href="/dashboard" className="transition hover:text-slate-950">
                Dashboard
              </Link>
            ) : null}
            {user?.role === "admin" ? (
              <Link href="/admin" className="transition hover:text-slate-950">
                Admin
              </Link>
            ) : null}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="group flex items-center gap-3 rounded-full border border-slate-200 bg-white/90 px-3 py-2 shadow-sm transition hover:border-slate-300 hover:bg-white"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-sm">
                    {userInitials}
                  </span>
                  <div className="pr-1">
                    <p className="text-sm font-semibold text-slate-900">{userPrimaryLabel}</p>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                      {user.role === "admin" ? "Admin account" : "Account"}
                    </p>
                  </div>
                </Link>
                <Link href="/booking" className={buttonClasses("primary", "sm")}>
                  Book Now
                </Link>
                <SignOutButton variant="ghost" size="sm" />
              </>
            ) : (
              <>
                <Link href="/login" className={buttonClasses("secondary", "sm")}>
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

        <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 md:hidden">
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
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-sm">
                {userInitials}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900">{userPrimaryLabel}</p>
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                  {user.role === "admin" ? "Admin account" : "Account"}
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
