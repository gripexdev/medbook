import { NextResponse } from "next/server";
import { createAvailabilityWindow, listAvailabilityWindows } from "@/lib/availability";
import { getSessionUser } from "@/lib/auth";
import { isAdminUser } from "@/lib/users";
import { availabilityWindowSchema, getValidationMessage } from "@/lib/validators";

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

  return NextResponse.json({ windows: listAvailabilityWindows() });
}

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return unauthorizedResponse();
  }

  if (!isAdminUser(user)) {
    return forbiddenResponse();
  }

  try {
    const payload = await request.json();
    const validation = availabilityWindowSchema.safeParse(payload);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: getValidationMessage(validation.error, "Please review the availability window."),
          fieldErrors: validation.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const windows = createAvailabilityWindow(validation.data);
    return NextResponse.json({ windows }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to save the availability window right now." },
      { status: 500 }
    );
  }
}
