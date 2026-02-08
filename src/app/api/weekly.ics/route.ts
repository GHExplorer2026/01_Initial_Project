import { parseScopeSelection, ScopeConflictError } from "@/core/scope";
import { generateWeeklyOutlook } from "@/server/orchestrator";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const scope = parseScopeSelection(url.searchParams);
    const result = await generateWeeklyOutlook({ regions: scope.regions });

    const fileDate = result.meta.weekStartBerlinISO.slice(0, 10);

    return new Response(result.icsPayload, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="Wochenausblick_${fileDate}.ics"`
      }
    });
  } catch (error) {
    if (error instanceof ScopeConflictError) {
      return new Response("regions and countries parameters conflict", { status: 400 });
    }

    return new Response("failed to generate ics", { status: 500 });
  }
}
