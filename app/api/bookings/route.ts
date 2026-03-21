import { NextResponse } from "next/server";
import { createBookingForUser, listBookingsForUser } from "@/lib/bookings";
import { getSessionUser } from "@/lib/auth";
import { bookingSchema, getValidationMessage } from "@/lib/validators";

function unauthorizedResponse() {
  return NextResponse.json(
    { error: "You must be signed in to access bookings." },
    { status: 401 }
  );
}

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return unauthorizedResponse();
  }

  try {
    const bookings = listBookingsForUser(user.id);
    return NextResponse.json({ bookings });
  } catch {
    return NextResponse.json(
      { error: "Unable to load bookings at the moment." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return unauthorizedResponse();
  }

  try {
    const payload = await request.json();
    const validation = bookingSchema.safeParse(payload);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: getValidationMessage(validation.error, "Please correct the booking details."),
          fieldErrors: validation.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const result = createBookingForUser(user, validation.data);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to save the booking right now." },
      { status: 500 }
    );
  }
}
