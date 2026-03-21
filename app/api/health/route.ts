import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const healthCheck = db.prepare("SELECT 1 as ok").get() as { ok: number };

  return NextResponse.json({
    status: healthCheck.ok === 1 ? "ok" : "error",
    timestamp: new Date().toISOString()
  });
}
