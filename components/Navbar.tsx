import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { buttonClasses } from "@/components/Button";
import SignOutButton from "@/components/SignOutButton";
import { getSessionUser } from "@/lib/auth";
import { siteConfig } from "@/config/site";

export default async function Navbar() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="section-shell py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="text-slate-900 transition hover:opacity-90">
            <BrandLogo />
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
                <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-right">
                  <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
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
            <Link href={user ? "/booking" : "/login"} className={buttonClasses("primary", "sm")}>
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
            <div>
              <p className="font-semibold text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <SignOutButton variant="ghost" size="sm" />
          </div>
        ) : null}
      </div>
    </header>
  );
}
