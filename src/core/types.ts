export const REGION_ORDER = ["USA", "EZ", "UK", "JP", "CH", "CA", "AU", "NZ"] as const;

export type RegionCode = (typeof REGION_ORDER)[number];

export const REGION_LABELS: Record<RegionCode, string> = {
  USA: "USA",
  EZ: "Euro Zone",
  UK: "United Kingdom",
  JP: "Japan",
  CH: "Switzerland",
  CA: "Canada",
  AU: "Australia",
  NZ: "New Zealand"
};

export const CURRENCY_TO_REGION: Record<string, RegionCode> = {
  USD: "USA",
  EUR: "EZ",
  GBP: "UK",
  JPY: "JP",
  CHF: "CH",
  CAD: "CA",
  AUD: "AU",
  NZD: "NZ"
};

export type CurrencyCode = keyof typeof CURRENCY_TO_REGION;

export type CategoryAF = "A" | "B" | "C" | "D" | "E" | "F";

export type EventSource = "investing" | "tradingview" | `tertiary:${string}`;
export type EventTimeKind = "exact" | "all_day";
export type EventImportance = "low" | "medium" | "high" | "unknown";

export type EventMetricValue = {
  value: string;
  source: EventSource;
  asOfISO: string;
};

export type RawSourceEvent = {
  source: EventSource;
  region?: RegionCode;
  currency?: CurrencyCode;
  title: string;
  date: string;
  time: string;
  timeKind?: EventTimeKind;
  importance?: EventImportance;
  actual?: string;
  forecast?: string;
  previous?: string;
  fetchedAtISO: string;
  sourceUrlHash?: string;
};

export type EconomicEvent = {
  source: EventSource;
  region: RegionCode;
  currency: CurrencyCode;
  titleRaw: string;
  titleNormalized: string;
  categoryAF?: CategoryAF;
  dateBerlinISO: string;
  datetimeBerlinISO: string;
  timeKind: EventTimeKind;
  timeHHMM?: string;
  hasExactTime: boolean;
  isTopEvent: boolean;
  importance: EventImportance;
  actual?: EventMetricValue;
  forecast?: EventMetricValue;
  previous?: EventMetricValue;
  provenance: {
    fetchedAtISO: string;
    parserVersion: string;
    sourceUrlHash?: string;
  };
};

export type GroupedRenderEvent = {
  region: RegionCode;
  day: string;
  timeKind: EventTimeKind;
  timeHHMM?: string;
  title: string;
  isTopEvent: boolean;
  datetimeBerlinISO: string;
};

export type RenderDay = {
  dateBerlinISO: string;
  dayHeader: string;
  lines?: string[];
  note?: string;
};

export type WeekRange = {
  weekStart: string;
  weekEnd: string;
  days: string[];
};

export type ScopeSelection = {
  regions: RegionCode[];
  usedDeprecatedCountriesAlias: boolean;
};

export type DayStatus = {
  holidayTriggered: boolean;
  isWeekend: boolean;
  verificationFailed: boolean;
};

export type WeeklyOutput = {
  renderedText: string;
  events: EconomicEvent[];
  days: RenderDay[];
  meta: {
    parserVersion: string;
    generatedAtISO: string;
    weekStartBerlinISO: string;
    weekEndBerlinISO: string;
    sourceMode: "fixtures" | "live";
    sourcesUsed: string[];
  };
  icsPayload: string;
};
