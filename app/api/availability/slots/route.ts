import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/availability";
import { getValidationMessage, slotsQuerySchema } from "@/lib/validators";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const validation = slotsQuerySchema.safeParse({
    serviceId: searchParams.get("serviceId") || "",
    date: searchParams.get("date") || ""
  });

  if (!validation.success) {
    return NextResponse.json(
      { error: getValidationMessage(validation.error, "Please provide a valid date and service.") },
      { status: 400 }
    );
  }

  const slots = getAvailableSlots(validation.data.serviceId, validation.data.date);
  return NextResponse.json({ slots });
}
