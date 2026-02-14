import type { RegionCode } from "@/core/types";
import { readFixtureEvents } from "@/server/sources/common";
import type { SourceFetchResult } from "@/server/sources/types";

export const fetchApprovedTertiaryFixtureEvents = async (
  weekStart: string,
  weekEnd: string,
  regions: RegionCode[]
): Promise<SourceFetchResult> => readFixtureEvents("tertiary.json", weekStart, weekEnd, regions);

export const fetchApprovedTertiaryLiveEvents = async (
  _weekStart: string,
  _weekEnd: string,
  _regions: RegionCode[]
): Promise<SourceFetchResult> => {
  void _weekStart;
  void _weekEnd;
  void _regions;

  return {
    ok: false,
    events: [],
    error: "approved tertiary live adapters not configured"
  };
};
