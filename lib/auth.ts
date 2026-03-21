import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { findUserById, isAdminUser, toSessionUser } from "@/lib/users";
import type { SessionUser } from "@/lib/types";

const SESSION_COOKIE_NAME = "medbook_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getAuthSecret() {
  const configuredSecret = process.env.AUTH_SECRET?.trim();

  if (configuredSecret) {
    return configuredSecret;
  }

  if (process.env.NODE_ENV !== "production") {
    return "medbook-development-secret-change-this";
  }

  throw new Error("AUTH_SECRET is required in production.");
}

function isSecureRequest(request?: Request) {
  if (!request) {
    return process.env.NODE_ENV === "production";
  }

  const forwardedProto = request.headers.get("x-forwarded-proto");

  if (forwardedProto) {
    return forwardedProto.split(",")[0].trim() === "https";
  }

  try {
    return new URL(request.url).protocol === "https:";
  } catch {
    return process.env.NODE_ENV === "production";
  }
}

function getCookieOptions(request?: Request) {
  return {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE,
    path: "/",
    sameSite: "lax" as const,
    secure: isSecureRequest(request)
  };
}

export function sanitizeRedirectPath(redirectTo?: string | null) {
  if (!redirectTo || !redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    return "/dashboard";
  }

  return redirectTo;
}

function signSessionToken(user: SessionUser) {
  return jwt.sign(
    {
      email: user.email,
      name: user.name,
      role: user.role
    },
    getAuthSecret(),
    {
      algorithm: "HS256",
      expiresIn: SESSION_MAX_AGE,
      subject: user.id
    }
  );
}

export async function applySessionCookie(response: NextResponse, user: SessionUser, request?: Request) {
  const token = signSessionToken(user);
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    ...getCookieOptions(request)
  });
}

export function clearSessionCookie(response: NextResponse, request?: Request) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    ...getCookieOptions(request),
    maxAge: 0
  });
}

export async function getSessionUser() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    const payload = jwt.verify(sessionToken, getAuthSecret());
    const userId =
      typeof payload === "object" && payload && typeof payload.sub === "string"
        ? payload.sub
        : "";

    if (!userId) {
      return null;
    }

    const storedUser = findUserById(userId);
    return storedUser ? toSessionUser(storedUser) : null;
  } catch {
    return null;
  }
}

export async function requireSessionUser(redirectTo = "/dashboard") {
  const user = await getSessionUser();

  if (!user) {
    redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  return user;
}

export async function requireAdminUser(redirectTo = "/admin") {
  const user = await requireSessionUser(redirectTo);

  if (!isAdminUser(user)) {
    redirect("/dashboard");
  }

  return user;
}
