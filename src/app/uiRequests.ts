import type { RegionCode } from "@/core/types";
import { serializeRegionsParam } from "@/app/scopeState";

export type IcsImportanceSelection = "high" | "medium";

const ICS_IMPORTANCE_ORDER: readonly IcsImportanceSelection[] = ["high", "medium"];

const serializeIcsImportanceParam = (filters: readonly IcsImportanceSelection[]): string => {
  const unique = new Set(filters);
  return ICS_IMPORTANCE_ORDER.filter((item) => unique.has(item)).join(",");
};

export const buildWeeklyEndpoint = (regions: readonly RegionCode[]): string =>
  `/api/weekly?regions=${encodeURIComponent(serializeRegionsParam(regions))}`;

export const buildIcsEndpoint = (
  regions: readonly RegionCode[],
  filters: readonly IcsImportanceSelection[] = []
): string => {
  const params = new URLSearchParams();
  params.set("regions", serializeRegionsParam(regions));
  const serializedFilters = serializeIcsImportanceParam(filters);
  if (serializedFilters) {
    params.set("icsImportance", serializedFilters);
  }
  return `/api/weekly.ics?${params.toString()}`;
};
