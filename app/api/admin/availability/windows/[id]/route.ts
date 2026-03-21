import { NextResponse } from "next/server";
import { deleteAvailabilityWindow } from "@/lib/availability";
import { getSessionUser } from "@/lib/auth";
import { isAdminUser } from "@/lib/users";

type AdminAvailabilityWindowRouteContext = {
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

export async function DELETE(_request: Request, { params }: AdminAvailabilityWindowRouteContext) {
  const user = await getSessionUser();

  if (!user) {
    return unauthorizedResponse();
  }

  if (!isAdminUser(user)) {
    return forbiddenResponse();
  }

  const deleted = deleteAvailabilityWindow(params.id);

  if (!deleted) {
    return NextResponse.json({ error: "Availability window not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
