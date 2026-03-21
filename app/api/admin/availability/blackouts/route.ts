import { NextResponse } from "next/server";
import { createBlackoutDate, listBlackoutDates } from "@/lib/availability";
import { getSessionUser } from "@/lib/auth";
import { isAdminUser } from "@/lib/users";
import { blackoutDateSchema, getValidationMessage } from "@/lib/validators";

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

  return NextResponse.json({ blackouts: listBlackoutDates() });
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
    const validation = blackoutDateSchema.safeParse(payload);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: getValidationMessage(validation.error, "Please review the blackout date."),
          fieldErrors: validation.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const result = createBlackoutDate(validation.data);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to save the blackout date right now." },
      { status: 500 }
    );
  }
}
