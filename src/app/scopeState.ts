import { REGION_ORDER, type RegionCode } from "@/core/types";

export type RegionOption = {
  code: RegionCode;
  label: string;
};

export const REGION_OPTIONS: RegionOption[] = [
  { code: "USA", label: "USA (USD)" },
  { code: "EZ", label: "Euro Zone (EUR)" },
  { code: "UK", label: "United Kingdom (GBP)" },
  { code: "JP", label: "Japan (JPY)" },
  { code: "CH", label: "Switzerland (CHF)" },
  { code: "CA", label: "Canada (CAD)" },
  { code: "AU", label: "Australia (AUD)" },
  { code: "NZ", label: "New Zealand (NZD)" }
];

export const STORAGE_KEY = "macro_regions_v1";

const REGION_SET = new Set<RegionCode>(REGION_ORDER);

export const allRegionsSelection = (): RegionCode[] => [...REGION_ORDER];

export const normalizeRegionCodes = (values: readonly string[]): RegionCode[] => {
  const normalized = new Set<RegionCode>();
  for (const value of values) {
    const upper = value.trim().toUpperCase() as RegionCode;
    if (REGION_SET.has(upper)) {
      normalized.add(upper);
    }
  }
  return REGION_ORDER.filter((region) => normalized.has(region));
};

export const parseRegionsParamFromSearch = (
  search: string
): {
  hasRegionsParam: boolean;
  regions: RegionCode[];
} => {
  const params = new URLSearchParams(search);
  if (!params.has("regions")) {
    return { hasRegionsParam: false, regions: [] };
  }
  const raw = params.get("regions");
  if (raw === null || raw.trim() === "") {
    return { hasRegionsParam: true, regions: [] };
  }
  return {
    hasRegionsParam: true,
    regions: normalizeRegionCodes(raw.split(","))
  };
};

export const parseRegionsFromStorageValue = (raw: string | null): RegionCode[] | null => {
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return null;
    }
    return normalizeRegionCodes(parsed.map((value) => String(value)));
  } catch {
    return null;
  }
};

export const resolveInitialRegionSelection = (search: string, storageRaw: string | null): RegionCode[] => {
  const fromQuery = parseRegionsParamFromSearch(search);
  if (fromQuery.hasRegionsParam) {
    return fromQuery.regions;
  }

  const fromStorage = parseRegionsFromStorageValue(storageRaw);
  if (fromStorage) {
    return fromStorage;
  }

  return allRegionsSelection();
};

export const serializeRegionsParam = (regions: readonly RegionCode[]): string =>
  normalizeRegionCodes(regions).join(",");

export const buildSearchWithRegions = (search: string, regions: readonly RegionCode[]): string => {
  const params = new URLSearchParams(search);
  params.set("regions", serializeRegionsParam(regions));
  return params.toString();
};

export const toggleRegionSelection = (current: readonly RegionCode[], region: RegionCode): RegionCode[] => {
  const next = new Set<RegionCode>(current);
  if (next.has(region)) {
    next.delete(region);
  } else {
    next.add(region);
  }
  return REGION_ORDER.filter((candidate) => next.has(candidate));
};
