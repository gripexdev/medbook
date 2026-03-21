import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { listAllBookings } from "@/lib/bookings";
import { isAdminUser } from "@/lib/users";

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

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return unauthorizedResponse();
  }

  if (!isAdminUser(user)) {
    return forbiddenResponse();
  }

  return NextResponse.json({ bookings: listAllBookings() });
}
