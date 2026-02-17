import type { RegionCode } from "@/core/types";

export const DATE_PRESETS = ["yesterday", "today", "tomorrow", "this_week", "next_week", "custom"] as const;
export type DatePreset = (typeof DATE_PRESETS)[number];

export const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "NZD"] as const;
export type CurrencyCode = (typeof CURRENCIES)[number];

export const IMPORTANCE_LEVELS = ["high", "medium", "low", "unknown"] as const;
export type ImportanceLevel = (typeof IMPORTANCE_LEVELS)[number];

export type WidgetSettings = {
  datePreset: DatePreset;
  customFrom?: string;
  customTo?: string;
  countries: RegionCode[];
  currencies: CurrencyCode[];
  importanceLevels: ImportanceLevel[];
  toggleBarEnabled: boolean;
  alwaysOnTop: boolean;
  transparency: number;
  tickerSpeed: "slow" | "normal" | "fast";
  timezoneMode: "windows" | "berlin_fallback";
};

export type WidgetFeedEvent = {
  eventId: string;
  datetimeUTC: string;
  timeKind: "exact" | "all_day";
  region: RegionCode;
  countryLabel: string;
  currency: CurrencyCode;
  titleRaw: string;
  importance: ImportanceLevel;
  isTopEvent: boolean;
  actual?: string;
  forecast?: string;
  previous?: string;
  source: string;
  provenance: {
    fetchedAtISO: string;
    parserVersion: string;
    sourceUrlHash?: string;
  };
};

export type WidgetFeedResponse = {
  meta: {
    feedVersion: string;
    generatedAtUTC: string;
    parserVersion: string;
    sourceMode: "fixtures" | "live";
    sourcesUsed: string[];
    timezoneReference: "UTC";
  };
  events: WidgetFeedEvent[];
};

export const DEFAULT_WIDGET_SETTINGS: WidgetSettings = {
  datePreset: "today",
  countries: ["USA", "EZ", "UK", "JP", "CH", "CA", "AU", "NZ"],
  currencies: [...CURRENCIES],
  importanceLevels: [...IMPORTANCE_LEVELS],
  toggleBarEnabled: true,
  alwaysOnTop: false,
  transparency: 90,
  tickerSpeed: "normal",
  timezoneMode: "windows"
};

const unique = <T extends string>(values: readonly T[]): T[] => {
  const out: T[] = [];
  for (const v of values) {
    if (!out.includes(v)) {
      out.push(v);
    }
  }
  return out;
};

export const buildWidgetFeedEndpoint = (settings: WidgetSettings): string => {
  const params = new URLSearchParams();
  params.set("regions", unique(settings.countries).join(","));
  params.set("datePreset", settings.datePreset);

  const currencies = unique(settings.currencies);
  if (currencies.length > 0) {
    params.set("currencies", currencies.join(","));
  }

  const importance = unique(settings.importanceLevels);
  if (importance.length > 0) {
    params.set("importance", importance.join(","));
  }

  if (settings.datePreset === "custom") {
    if (settings.customFrom) {
      params.set("customFrom", settings.customFrom);
    }
    if (settings.customTo) {
      params.set("customTo", settings.customTo);
    }
  }

  return `/api/widget-feed?${params.toString()}`;
};

const localDateTime = (utcIso: string): { dateLabel: string; timeLabel: string } => {
  const d = new Date(utcIso);
  const dateLabel = new Intl.DateTimeFormat("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(d);
  const timeLabel = new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(d);
  return { dateLabel, timeLabel };
};

export type TickerItem = {
  id: string;
  text: string;
  isTop: boolean;
};

export const toTickerItems = (events: readonly WidgetFeedEvent[]): TickerItem[] =>
  events.map((event) => {
    const metric = (value: string | undefined): string => {
      if (typeof value !== "string") {
        return "n/a";
      }
      const normalized = value.trim();
      return normalized.length > 0 ? normalized : "n/a";
    };
    const metrics = `A:${metric(event.actual)} F:${metric(event.forecast)} P:${metric(event.previous)}`;
    const dateTime = event.timeKind === "all_day" ? "All Day" : `${localDateTime(event.datetimeUTC).timeLabel}`;
    return {
      id: event.eventId,
      isTop: event.isTopEvent || event.importance === "high",
      text: `${dateTime} ${event.region} ${event.titleRaw} ${metrics}`
    };
  });
