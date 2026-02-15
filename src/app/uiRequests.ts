import type { RegionCode } from "@/core/types";
import { serializeRegionsParam } from "@/app/scopeState";

export const buildWeeklyEndpoint = (regions: readonly RegionCode[]): string =>
  `/api/weekly?regions=${encodeURIComponent(serializeRegionsParam(regions))}`;

export const buildIcsEndpoint = (regions: readonly RegionCode[]): string =>
  `/api/weekly.ics?regions=${encodeURIComponent(serializeRegionsParam(regions))}`;
