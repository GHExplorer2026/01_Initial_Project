import { CURRENCY_TO_REGION, REGION_ORDER, type RegionCode, type ScopeSelection } from "@/core/types";

const normalizeRegions = (input: string): RegionCode[] => {
  const values = input
    .split(",")
    .map((v) => v.trim().toUpperCase())
    .filter(Boolean);

  const allowed = new Set(REGION_ORDER);
  const out: RegionCode[] = [];

  for (const value of values) {
    if (allowed.has(value as RegionCode)) {
      const region = value as RegionCode;
      if (!out.includes(region)) {
        out.push(region);
      }
    }
  }

  return out;
};

const normalizeCurrencies = (input: string): RegionCode[] => {
  const values = input
    .split(",")
    .map((v) => v.trim().toUpperCase())
    .filter(Boolean);

  const out: RegionCode[] = [];
  for (const value of values) {
    const mapped = CURRENCY_TO_REGION[value];
    if (mapped && !out.includes(mapped)) {
      out.push(mapped);
    }
  }

  return out;
};

const sameRegions = (a: RegionCode[], b: RegionCode[]): boolean => {
  const as = [...a].sort();
  const bs = [...b].sort();
  if (as.length !== bs.length) {
    return false;
  }
  return as.every((x, i) => x === bs[i]);
};

export class ScopeConflictError extends Error {}

export const parseScopeSelection = (searchParams: URLSearchParams): ScopeSelection => {
  const regionsParam = searchParams.get("regions");
  const countriesParam = searchParams.get("countries");

  const regionsFromPrimary = regionsParam ? normalizeRegions(regionsParam) : [];
  const regionsFromDeprecated = countriesParam ? normalizeCurrencies(countriesParam) : [];

  if (regionsFromPrimary.length > 0 && regionsFromDeprecated.length > 0 && !sameRegions(regionsFromPrimary, regionsFromDeprecated)) {
    throw new ScopeConflictError("regions and countries parameters conflict");
  }

  const regions =
    regionsFromPrimary.length > 0
      ? regionsFromPrimary
      : regionsFromDeprecated.length > 0
        ? regionsFromDeprecated
        : [...REGION_ORDER];

  return {
    regions,
    usedDeprecatedCountriesAlias: regionsFromPrimary.length === 0 && regionsFromDeprecated.length > 0
  };
};
