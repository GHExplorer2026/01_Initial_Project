import { parseScopeSelection, ScopeConflictError } from "@/core/scope";
import { generateWidgetFeed, WidgetFeedQueryError } from "@/server/widgetFeed";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const scope = parseScopeSelection(url.searchParams);
    const payload = await generateWidgetFeed({
      regions: scope.regions,
      searchParams: url.searchParams
    });

    return NextResponse.json(payload);
  } catch (error) {
    if (error instanceof ScopeConflictError) {
      return NextResponse.json({ error: "regions and countries parameters conflict" }, { status: 400 });
    }

    if (error instanceof WidgetFeedQueryError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "failed to generate widget feed" }, { status: 500 });
  }
}
