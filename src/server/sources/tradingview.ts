import type { RegionCode } from "@/core/types";
import { readFixtureEvents } from "@/server/sources/common";
import type { SourceFetchResult } from "@/server/sources/types";

export const fetchTradingViewEvents = async (
  weekStart: string,
  weekEnd: string,
  regions: RegionCode[]
): Promise<SourceFetchResult> => readFixtureEvents("tradingview.json", weekStart, weekEnd, regions);
