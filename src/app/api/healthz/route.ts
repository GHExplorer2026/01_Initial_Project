import { resolveSourceMode } from "@/server/sourceMode";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    sourceMode: resolveSourceMode(),
    generatedAtUTC: new Date().toISOString()
  });
}
