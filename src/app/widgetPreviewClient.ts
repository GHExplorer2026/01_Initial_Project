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

export const WIDGET_SETTINGS_STORAGE_KEY = "widget.preview.settings";
export const WIDGET_SETTINGS_VERSION = 1;

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

type StoredWidgetSettingsEnvelope = {
  version: number;
  settings: unknown;
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

const toYmd = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }
  const normalized = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return normalized;
  }
  return undefined;
};

const toBoolean = (value: unknown, fallback: boolean): boolean => (typeof value === "boolean" ? value : fallback);

const toNumberRange = (value: unknown, fallback: number, min: number, max: number): number => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }
  const clamped = Math.max(min, Math.min(max, value));
  return Math.round(clamped);
};

const normalizeSubset = <T extends string>(input: unknown, allowed: readonly T[], fallback: readonly T[]): T[] => {
  if (!Array.isArray(input)) {
    return [...fallback];
  }
  const allowedSet = new Set(allowed);
  const picked = input
    .filter((value): value is T => typeof value === "string" && allowedSet.has(value as T))
    .filter((value, index, all) => all.indexOf(value) === index);

  return picked.length > 0 ? picked : [...fallback];
};

export const normalizeWidgetSettings = (input: unknown): WidgetSettings => {
  if (!input || typeof input !== "object") {
    return { ...DEFAULT_WIDGET_SETTINGS };
  }

  const raw = input as Partial<WidgetSettings>;
  const datePreset = DATE_PRESETS.includes(raw.datePreset as DatePreset) ? (raw.datePreset as DatePreset) : "today";
  const countries = normalizeSubset(raw.countries, DEFAULT_WIDGET_SETTINGS.countries, DEFAULT_WIDGET_SETTINGS.countries);
  const currencies = normalizeSubset(raw.currencies, CURRENCIES, DEFAULT_WIDGET_SETTINGS.currencies);
  const importanceLevels = normalizeSubset(raw.importanceLevels, IMPORTANCE_LEVELS, DEFAULT_WIDGET_SETTINGS.importanceLevels);
  const tickerSpeed = raw.tickerSpeed === "slow" || raw.tickerSpeed === "normal" || raw.tickerSpeed === "fast" ? raw.tickerSpeed : "normal";
  const timezoneMode = raw.timezoneMode === "windows" || raw.timezoneMode === "berlin_fallback" ? raw.timezoneMode : "windows";
  const customFrom = datePreset === "custom" ? toYmd(raw.customFrom) : undefined;
  const customTo = datePreset === "custom" ? toYmd(raw.customTo) : undefined;

  return {
    datePreset,
    customFrom,
    customTo,
    countries,
    currencies,
    importanceLevels,
    toggleBarEnabled: toBoolean(raw.toggleBarEnabled, DEFAULT_WIDGET_SETTINGS.toggleBarEnabled),
    alwaysOnTop: toBoolean(raw.alwaysOnTop, DEFAULT_WIDGET_SETTINGS.alwaysOnTop),
    transparency: toNumberRange(raw.transparency, DEFAULT_WIDGET_SETTINGS.transparency, 0, 100),
    tickerSpeed,
    timezoneMode
  };
};

export const parseStoredWidgetSettings = (raw: string | null): WidgetSettings => {
  if (!raw) {
    return { ...DEFAULT_WIDGET_SETTINGS };
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && "version" in parsed && "settings" in parsed) {
      const envelope = parsed as StoredWidgetSettingsEnvelope;
      if (envelope.version === WIDGET_SETTINGS_VERSION) {
        return normalizeWidgetSettings(envelope.settings);
      }
      return normalizeWidgetSettings(envelope.settings);
    }

    // Legacy payload support (pre-envelope)
    return normalizeWidgetSettings(parsed);
  } catch {
    return { ...DEFAULT_WIDGET_SETTINGS };
  }
};

export const serializeWidgetSettings = (settings: WidgetSettings): string =>
  JSON.stringify({
    version: WIDGET_SETTINGS_VERSION,
    settings: normalizeWidgetSettings(settings)
  });

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

export type WidgetLaneState = "idle" | "loading" | "error" | "empty" | "ready";

export const deriveWidgetLaneState = (params: {
  loading: boolean;
  error: string;
  hasFeed: boolean;
  eventCount: number;
}): WidgetLaneState => {
  if (params.loading) {
    return "loading";
  }
  if (params.error.trim().length > 0) {
    return "error";
  }
  if (!params.hasFeed) {
    return "idle";
  }
  if (params.eventCount === 0) {
    return "empty";
  }
  return "ready";
};
