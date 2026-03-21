import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

export async function GET() {
  return NextResponse.json({ services: siteConfig.services });
}
