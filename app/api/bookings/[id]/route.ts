import { NextResponse } from "next/server";
import { cancelBookingForUser, getBookingByIdForUser } from "@/lib/bookings";
import { getSessionUser } from "@/lib/auth";

type BookingRouteContext = {
  params: {
    id: string;
  };
};

function unauthorizedResponse() {
  return NextResponse.json(
    { error: "You must be signed in to access bookings." },
    { status: 401 }
  );
}

export async function GET(_request: Request, { params }: BookingRouteContext) {
  const user = await getSessionUser();

  if (!user) {
    return unauthorizedResponse();
  }

  const booking = getBookingByIdForUser(user.id, params.id);

  if (!booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  return NextResponse.json({ booking });
}

export async function PATCH(_request: Request, { params }: BookingRouteContext) {
  const user = await getSessionUser();

  if (!user) {
    return unauthorizedResponse();
  }

  try {
    const booking = cancelBookingForUser(user.id, params.id);

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch {
    return NextResponse.json(
      { error: "Unable to update the booking right now." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: BookingRouteContext) {
  return PATCH(request, context);
}
