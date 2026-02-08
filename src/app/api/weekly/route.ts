import { parseScopeSelection, ScopeConflictError } from "@/core/scope";
import { generateWeeklyOutlook } from "@/server/orchestrator";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const scope = parseScopeSelection(url.searchParams);
    const result = await generateWeeklyOutlook({ regions: scope.regions });

    return NextResponse.json({
      renderedText: result.renderedText,
      events: result.events,
      days: result.days,
      meta: result.meta
    });
  } catch (error) {
    if (error instanceof ScopeConflictError) {
      return NextResponse.json({ error: "regions and countries parameters conflict" }, { status: 400 });
    }

    return NextResponse.json({ error: "failed to generate weekly outlook" }, { status: 500 });
  }
}
