import { parseScopeSelection, ScopeConflictError } from "@/core/scope";
import type { IcsImportanceFilter } from "@/core/types";
import { generateWeeklyOutlook } from "@/server/orchestrator";

export const runtime = "nodejs";

const ICS_IMPORTANCE_ORDER: readonly IcsImportanceFilter[] = ["high", "medium"];

const parseIcsImportance = (searchParams: URLSearchParams): IcsImportanceFilter[] => {
  const raw = searchParams.getAll("icsImportance");
  if (raw.length === 0) {
    return [];
  }

  const found = new Set<IcsImportanceFilter>();
  for (const value of raw) {
    for (const token of value.split(",")) {
      const normalized = token.trim().toLowerCase();
      if (normalized === "high" || normalized === "medium") {
        found.add(normalized);
      }
    }
  }

  return ICS_IMPORTANCE_ORDER.filter((importance) => found.has(importance));
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const scope = parseScopeSelection(url.searchParams);
    const icsImportance = parseIcsImportance(url.searchParams);
    const result = await generateWeeklyOutlook({
      regions: scope.regions,
      ...(icsImportance.length > 0 ? { icsImportance } : {})
    });

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
