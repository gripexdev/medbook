import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";
import { getAvailableDates } from "@/lib/availability";
import { availableDatesQuerySchema, getValidationMessage } from "@/lib/validators";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const validation = availableDatesQuerySchema.safeParse({
    serviceId: searchParams.get("serviceId") || "",
    days: searchParams.get("days") || String(siteConfig.bookingWindowDays)
  });

  if (!validation.success) {
    return NextResponse.json(
      { error: getValidationMessage(validation.error, "Please provide a valid service.") },
      { status: 400 }
    );
  }

  const dates = getAvailableDates(validation.data.serviceId, validation.data.days);
  return NextResponse.json({ dates });
}
