import type { RegionCode } from "@/core/types";
import { readFixtureEvents } from "@/server/sources/common";
import type { SourceFetchResult } from "@/server/sources/types";

export const fetchApprovedTertiaryEvents = async (
  weekStart: string,
  weekEnd: string,
  regions: RegionCode[]
): Promise<SourceFetchResult> => readFixtureEvents("tertiary.json", weekStart, weekEnd, regions);
