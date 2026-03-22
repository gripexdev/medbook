import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { listAdminBookings } from "@/lib/bookings";
import { isAdminUser } from "@/lib/users";
import type { AdminBookingStatusFilter, AdminBookingsQuery } from "@/lib/types";

function unauthorizedResponse() {
  return NextResponse.json(
    { error: "You must be signed in to access admin routes." },
    { status: 401 }
  );
}

function forbiddenResponse() {
  return NextResponse.json(
    { error: "Admin access is required for this route." },
    { status: 403 }
  );
}

const DEFAULT_PAGE_SIZE = 8;
const MAX_PAGE_SIZE = 24;

function parsePositiveInt(value: string | null, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsedValue = Number.parseInt(value, 10);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
}

function normalizeFilters(request: Request): AdminBookingsQuery {
  const searchParams = new URL(request.url).searchParams;
  const rawStatus = searchParams.get("status");
  const status: AdminBookingStatusFilter =
    rawStatus === "confirmed" || rawStatus === "completed" || rawStatus === "cancelled"
      ? rawStatus
      : "all";

  return {
    page: parsePositiveInt(searchParams.get("page"), 1),
    pageSize: Math.min(parsePositiveInt(searchParams.get("pageSize"), DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE),
    status,
    query: searchParams.get("q")?.trim().slice(0, 80) || ""
  };
}

export async function GET(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return unauthorizedResponse();
  }

  if (!isAdminUser(user)) {
    return forbiddenResponse();
  }

  return NextResponse.json(listAdminBookings(normalizeFilters(request)));
}
