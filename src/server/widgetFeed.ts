import { REGION_LABELS, type CurrencyCode, type EconomicEvent, type EventImportance, type RegionCode } from "@/core/types";
import { generateWeeklyOutlook } from "@/server/orchestrator";

const FEED_VERSION = "1.1";
const TIMEZONE_REFERENCE = "UTC" as const;

const DATE_PRESETS = ["yesterday", "today", "tomorrow", "this_week", "next_week", "custom"] as const;
type DatePreset = (typeof DATE_PRESETS)[number];

const IMPORTANCE_LEVELS = ["high", "medium", "low", "unknown"] as const;
const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "NZD"] as const;

const IMPORTANCE_ORDER: Record<EventImportance, number> = {
  high: 0,
  medium: 1,
  low: 2,
  unknown: 3
};

const DAY_MS = 24 * 60 * 60 * 1000;
const YMD_RE = /^\d{4}-\d{2}-\d{2}$/;
const HHMM_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

const toYmd = (date: Date): string => {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const addDaysUtc = (date: Date, days: number): Date => new Date(date.getTime() + days * DAY_MS);

const parseYmd = (value: string): Date | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const d = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) {
    return null;
  }
  return d;
};

const getBerlinTodayUtcDate = (now: Date): Date => {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  const ymd = fmt.format(now);
  return new Date(`${ymd}T00:00:00Z`);
};

const mondayOf = (date: Date): Date => {
  const day = date.getUTCDay();
  const mondayDelta = day === 0 ? -6 : 1 - day;
  return addDaysUtc(date, mondayDelta);
};

const parseCsv = (value: string | null): string[] => {
  if (!value) {
    return [];
  }
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
};

const parseDatePreset = (searchParams: URLSearchParams): DatePreset => {
  const raw = (searchParams.get("datePreset") ?? "today").trim().toLowerCase().replace(/\s+/g, "_");
  if (!DATE_PRESETS.includes(raw as DatePreset)) {
    throw new WidgetFeedQueryError("invalid datePreset parameter");
  }
  return raw as DatePreset;
};

const parseImportance = (searchParams: URLSearchParams): EventImportance[] => {
  const values = parseCsv(searchParams.get("importance")).map((v) => v.toLowerCase());
  const allowed = new Set(IMPORTANCE_LEVELS);
  const out: EventImportance[] = [];

  for (const value of values) {
    if (allowed.has(value as EventImportance) && !out.includes(value as EventImportance)) {
      out.push(value as EventImportance);
    }
  }

  return out;
};

const parseCurrencies = (searchParams: URLSearchParams): CurrencyCode[] => {
  const values = parseCsv(searchParams.get("currencies")).map((v) => v.toUpperCase());
  const allowed = new Set<string>(CURRENCIES);
  const out: CurrencyCode[] = [];

  for (const value of values) {
    if (allowed.has(value as CurrencyCode) && !out.includes(value as CurrencyCode)) {
      out.push(value as CurrencyCode);
    }
  }

  return out;
};

const berlinOffsetForDay = (ymd: string): string => {
  if (!YMD_RE.test(ymd)) {
    return "+00:00";
  }

  const probe = new Date(`${ymd}T12:00:00Z`);
  if (Number.isNaN(probe.getTime())) {
    return "+00:00";
  }

  try {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Berlin",
    timeZoneName: "longOffset"
  }).formatToParts(probe);

  const tzName = parts.find((part) => part.type === "timeZoneName")?.value ?? "GMT+00:00";
  const match = tzName.match(/GMT([+-]\d{2}:\d{2})/);
  return match?.[1] ?? "+00:00";
  } catch {
    return "+00:00";
  }
};

const eventUtcIso = (event: EconomicEvent): string | null => {
  if (!YMD_RE.test(event.dateBerlinISO)) {
    return null;
  }

  if (event.timeKind === "exact" && !HHMM_RE.test(event.timeHHMM ?? "")) {
    return null;
  }

  const baseTime = event.timeKind === "exact" ? `${event.timeHHMM}:00` : "00:00:00";
  const offset = berlinOffsetForDay(event.dateBerlinISO);
  const asDate = new Date(`${event.dateBerlinISO}T${baseTime}${offset}`);
  if (Number.isNaN(asDate.getTime())) {
    return null;
  }

  return asDate.toISOString();
};

const resolveDateRange = (preset: DatePreset, now: Date, searchParams: URLSearchParams): { from: string; to: string } => {
  const berlinToday = getBerlinTodayUtcDate(now);

  if (preset === "custom") {
    const customFrom = (searchParams.get("customFrom") ?? "").trim();
    const customTo = (searchParams.get("customTo") ?? "").trim();
    const fromDate = parseYmd(customFrom);
    const toDate = parseYmd(customTo);

    if (!fromDate || !toDate || fromDate.getTime() > toDate.getTime()) {
      throw new WidgetFeedQueryError("invalid custom date range");
    }

    return { from: customFrom, to: customTo };
  }

  if (preset === "yesterday") {
    const d = addDaysUtc(berlinToday, -1);
    const ymd = toYmd(d);
    return { from: ymd, to: ymd };
  }

  if (preset === "today") {
    const ymd = toYmd(berlinToday);
    return { from: ymd, to: ymd };
  }

  if (preset === "tomorrow") {
    const d = addDaysUtc(berlinToday, 1);
    const ymd = toYmd(d);
    return { from: ymd, to: ymd };
  }

  const monday = mondayOf(berlinToday);
  if (preset === "this_week") {
    return { from: toYmd(monday), to: toYmd(addDaysUtc(monday, 4)) };
  }

  const nextMonday = addDaysUtc(monday, 7);
  return { from: toYmd(nextMonday), to: toYmd(addDaysUtc(nextMonday, 4)) };
};

const weekAnchors = (fromYmd: string, toYmd: string): Date[] => {
  const from = parseYmd(fromYmd);
  const to = parseYmd(toYmd);
  if (!from || !to) {
    return [];
  }

  const out: Date[] = [];
  let cursor = mondayOf(from);
  const end = mondayOf(to);

  while (cursor.getTime() <= end.getTime()) {
    out.push(new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth(), cursor.getUTCDate() + 1, 12, 0, 0)));
    cursor = addDaysUtc(cursor, 7);
  }

  return out;
};

const buildEventId = (event: EconomicEvent, parserVersion: string): string =>
  `${event.dateBerlinISO}|${event.timeKind}|${event.timeHHMM ?? "ALL_DAY"}|${event.region}|${event.titleNormalized}|${parserVersion}`;

const filterByPresetAndNow = (
  event: EconomicEvent,
  dateFrom: string,
  dateTo: string,
  allowPast: boolean,
  nowUtcMs: number,
  berlinTodayYmd: string
): boolean => {
  if (event.dateBerlinISO < dateFrom || event.dateBerlinISO > dateTo) {
    return false;
  }

  if (allowPast) {
    return true;
  }

  if (event.timeKind === "all_day") {
    return event.dateBerlinISO >= berlinTodayYmd;
  }

  const asUtc = eventUtcIso(event);
  if (!asUtc) {
    return false;
  }

  return new Date(asUtc).getTime() >= nowUtcMs;
};

const toFeedEvent = (event: EconomicEvent, parserVersion: string) => {
  const datetimeUTC = eventUtcIso(event);
  if (!datetimeUTC) {
    return null;
  }

  return {
    eventId: buildEventId(event, parserVersion),
    datetimeUTC,
    timeKind: event.timeKind,
    region: event.region,
    countryLabel: REGION_LABELS[event.region],
    currency: event.currency,
    titleRaw: event.titleRaw,
    importance: event.importance,
    isTopEvent: event.isTopEvent,
    actual: event.actual?.value,
    forecast: event.forecast?.value,
    previous: event.previous?.value,
    source: event.source,
    provenance: event.provenance
  };
};

type WidgetFeedEvent = NonNullable<ReturnType<typeof toFeedEvent>>;

const sortFeedEvents = (a: WidgetFeedEvent, b: WidgetFeedEvent): number => {
  if (a.datetimeUTC !== b.datetimeUTC) {
    return a.datetimeUTC.localeCompare(b.datetimeUTC);
  }
  if (a.importance !== b.importance) {
    return IMPORTANCE_ORDER[a.importance] - IMPORTANCE_ORDER[b.importance];
  }
  return a.region.localeCompare(b.region);
};

export class WidgetFeedQueryError extends Error {}

export type GenerateWidgetFeedParams = {
  regions: RegionCode[];
  searchParams: URLSearchParams;
  now?: Date;
};

export const generateWidgetFeed = async ({ regions, searchParams, now = new Date() }: GenerateWidgetFeedParams) => {
  const datePreset = parseDatePreset(searchParams);
  const importanceFilter = parseImportance(searchParams);
  const currencyFilter = parseCurrencies(searchParams);
  const range = resolveDateRange(datePreset, now, searchParams);
  const anchors = weekAnchors(range.from, range.to);

  const weeklyOutputs = await Promise.all(anchors.map((anchor) => generateWeeklyOutlook({ regions, now: anchor })));
  const allEvents = weeklyOutputs.flatMap((output) => output.events);

  const parserVersion = weeklyOutputs[0]?.meta.parserVersion ?? "unknown";
  const sourceMode = weeklyOutputs[0]?.meta.sourceMode ?? "fixtures";
  const generatedAtUTC = now.toISOString();
  const sourcesUsed = Array.from(new Set(weeklyOutputs.flatMap((output) => output.meta.sourcesUsed))).sort();
  const allowPast = datePreset === "yesterday";
  const berlinTodayYmd = toYmd(getBerlinTodayUtcDate(now));

  const filtered = allEvents
    .filter((event) => filterByPresetAndNow(event, range.from, range.to, allowPast, now.getTime(), berlinTodayYmd))
    .filter((event) => (importanceFilter.length > 0 ? importanceFilter.includes(event.importance) : true))
    .filter((event) => (currencyFilter.length > 0 ? currencyFilter.includes(event.currency) : true));

  const feedEvents = filtered
    .map((event) => toFeedEvent(event, parserVersion))
    .filter((event): event is NonNullable<ReturnType<typeof toFeedEvent>> => event !== null)
    .sort(sortFeedEvents);

  return {
    meta: {
      feedVersion: FEED_VERSION,
      generatedAtUTC,
      parserVersion,
      sourceMode,
      sourcesUsed,
      timezoneReference: TIMEZONE_REFERENCE
    },
    events: feedEvents
  };
};
