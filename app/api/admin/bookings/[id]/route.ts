import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getBookingById, updateBookingStatusAsAdmin } from "@/lib/bookings";
import { sendBookingCancellationNotification, sendBookingConfirmationNotification } from "@/lib/notifications";
import { isAdminUser } from "@/lib/users";
import { bookingStatusSchema, getValidationMessage } from "@/lib/validators";

type AdminBookingRouteContext = {
  params: {
    id: string;
  };
};

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

export async function PATCH(request: Request, { params }: AdminBookingRouteContext) {
  const user = await getSessionUser();

  if (!user) {
    return unauthorizedResponse();
  }

  if (!isAdminUser(user)) {
    return forbiddenResponse();
  }

  try {
    const payload = await request.json();
    const validation = bookingStatusSchema.safeParse(payload);

    if (!validation.success) {
      return NextResponse.json(
        { error: getValidationMessage(validation.error, "Choose a valid booking status.") },
        { status: 400 }
      );
    }

    const currentBooking = getBookingById(params.id);

    if (!currentBooking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    const result = updateBookingStatusAsAdmin(params.id, validation.data.status);

    if (!result) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    if (currentBooking.status !== result.booking.status) {
      if (result.booking.status === "cancelled") {
        await sendBookingCancellationNotification(result.booking);
      }

      if (result.booking.status === "confirmed") {
        await sendBookingConfirmationNotification(result.booking);
      }
    }

    return NextResponse.json({ booking: result.booking });
  } catch {
    return NextResponse.json(
      { error: "Unable to update the booking right now." },
      { status: 500 }
    );
  }
}
