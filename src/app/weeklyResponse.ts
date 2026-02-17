import type { EventImportance, EventTimeKind, RegionCode } from "@/core/types";

export type WeeklyEvent = {
  region: RegionCode;
  currency: string;
  titleRaw: string;
  dateBerlinISO: string;
  timeKind: EventTimeKind;
  timeHHMM?: string;
  importance: EventImportance;
  actual?: string;
  forecast?: string;
  previous?: string;
  isTopEvent: boolean;
};

export type WeeklyDay = {
  dateBerlinISO: string;
  dayHeader: string;
  note?: string;
};

export type WeeklyResponse = {
  renderedText?: unknown;
  events?: unknown;
  days?: unknown;
  meta?: {
    sourceMode?: unknown;
    sourcesUsed?: unknown;
  };
};

export type NormalizedWeeklyResponse = {
  renderedText: string;
  events: WeeklyEvent[];
  days: WeeklyDay[];
  sourceMode: "fixtures" | "live" | null;
  sourcesUsed: string[];
};

const normalizeSourceMode = (value: unknown): "fixtures" | "live" | null => {
  if (value === "fixtures" || value === "live") {
    return value;
  }
  return null;
};

const normalizeSourcesUsed = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  const cleaned = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  const unique = new Set<string>();
  for (const item of cleaned) {
    unique.add(item);
  }
  return [...unique].sort((a, b) => a.localeCompare(b));
};

const normalizeImportance = (value: unknown): EventImportance => {
  if (value === "low" || value === "medium" || value === "high" || value === "unknown") {
    return value;
  }
  return "unknown";
};

const normalizeMetric = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }
  const cleaned = value.trim();
  return cleaned ? cleaned : undefined;
};

const normalizeEvents = (value: unknown): WeeklyEvent[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const out: WeeklyEvent[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const record = item as Record<string, unknown>;
    const region = record.region;
    const currency = record.currency;
    const titleRaw = record.titleRaw;
    const dateBerlinISO = record.dateBerlinISO;
    const timeKind = record.timeKind;

    if (
      (region !== "USA" && region !== "EZ" && region !== "UK" && region !== "JP" && region !== "CH" && region !== "CA" && region !== "AU" && region !== "NZ") ||
      typeof currency !== "string" ||
      typeof titleRaw !== "string" ||
      typeof dateBerlinISO !== "string" ||
      (timeKind !== "exact" && timeKind !== "all_day")
    ) {
      continue;
    }

    const actual = normalizeMetric((record.actual as { value?: unknown } | undefined)?.value);
    const forecast = normalizeMetric((record.forecast as { value?: unknown } | undefined)?.value);
    const previous = normalizeMetric((record.previous as { value?: unknown } | undefined)?.value);

    const normalizedImportance = normalizeImportance(record.importance);
    const normalizedIsTop = record.isTopEvent === true || normalizedImportance === "high";

    out.push({
      region,
      currency: currency.trim(),
      titleRaw: titleRaw.trim(),
      dateBerlinISO: dateBerlinISO.trim(),
      timeKind,
      timeHHMM: typeof record.timeHHMM === "string" ? record.timeHHMM.trim() : undefined,
      importance: normalizedIsTop ? "high" : normalizedImportance,
      actual,
      forecast,
      previous,
      isTopEvent: normalizedIsTop
    });
  }

  return out;
};

const normalizeDays = (value: unknown): WeeklyDay[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const out: WeeklyDay[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const record = item as Record<string, unknown>;
    if (typeof record.dayHeader !== "string" || typeof record.dateBerlinISO !== "string") {
      continue;
    }
    out.push({
      dateBerlinISO: record.dateBerlinISO.trim(),
      dayHeader: record.dayHeader.trim(),
      note: typeof record.note === "string" ? record.note.trim() : undefined
    });
  }

  return out;
};

export const normalizeWeeklyResponse = (input: WeeklyResponse): NormalizedWeeklyResponse => {
  const renderedText = typeof input.renderedText === "string" ? input.renderedText : "";
  const meta = input.meta ?? {};
  return {
    renderedText,
    events: normalizeEvents(input.events),
    days: normalizeDays(input.days),
    sourceMode: normalizeSourceMode(meta.sourceMode),
    sourcesUsed: normalizeSourcesUsed(meta.sourcesUsed)
  };
};
