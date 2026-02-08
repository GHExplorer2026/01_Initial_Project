import type { RegionCode } from "@/core/types";
import { readFixtureEvents } from "@/server/sources/common";
import type { SourceFetchResult } from "@/server/sources/types";

export const fetchInvestingEvents = async (
  weekStart: string,
  weekEnd: string,
  regions: RegionCode[]
): Promise<SourceFetchResult> => readFixtureEvents("investing.json", weekStart, weekEnd, regions);
