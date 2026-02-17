import {
  CURRENCY_TO_REGION,
  type CurrencyCode,
  type EconomicEvent,
  type EventMetricValue,
  type EventTimeKind,
  type RawSourceEvent,
  type RegionCode
} from "@/core/types";
import { classifyAF, isTopEvent, normalizeTitle } from "@/core/classifier";

const EXACT_TIME = /^([01]\d|2[0-3]):([0-5]\d)$/;
const ALL_DAY_TIME = /^all\s*day$/i;
const TENTATIVE_TIME = /^tentative$/i;

const inferRegion = (event: RawSourceEvent): RegionCode | null => {
  if (event.region) {
    return event.region;
  }
  if (event.currency) {
    return CURRENCY_TO_REGION[event.currency];
  }
  return null;
};

const inferCurrency = (region: RegionCode): CurrencyCode => {
  const entries = Object.entries(CURRENCY_TO_REGION) as [CurrencyCode, RegionCode][];
  const found = entries.find(([, r]) => r === region);
  if (!found) {
    return "USD";
  }
  return found[0];
};

const isExactTime = (time: string): boolean => EXACT_TIME.test(time.trim());

const resolveTimeKind = (raw: RawSourceEvent): EventTimeKind | null => {
  if (raw.timeKind === "exact" || raw.timeKind === "all_day") {
    return raw.timeKind;
  }

  const time = raw.time.trim();
  if (!time || TENTATIVE_TIME.test(time)) {
    return null;
  }
  if (ALL_DAY_TIME.test(time)) {
    return "all_day";
  }
  if (isExactTime(time)) {
    return "exact";
  }
  return null;
};

const toMetric = (value: string | undefined, source: RawSourceEvent["source"], asOfISO: string): EventMetricValue | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }
  const normalized = value.trim();
  if (!normalized) {
    return undefined;
  }

  return {
    value: normalized,
    source,
    asOfISO
  };
};

export const normalizeEvents = (rawEvents: RawSourceEvent[], parserVersion: string): EconomicEvent[] => {
  const normalized: EconomicEvent[] = [];

  for (const raw of rawEvents) {
    const region = inferRegion(raw);
    if (!region) {
      continue;
    }

    const timeKind = resolveTimeKind(raw);
    if (!timeKind) {
      continue;
    }

    const time = raw.time.trim();

    const titleNormalized = normalizeTitle(raw.title);
    const categoryAF = classifyAF(titleNormalized) ?? undefined;
    if (!categoryAF && timeKind === "exact") {
      continue;
    }

    const day = raw.date.trim();
    const hasExactTime = timeKind === "exact";
    const metricAsOfISO = raw.fetchedAtISO;
    const actual = toMetric(raw.actual, raw.source, metricAsOfISO);
    const forecast = toMetric(raw.forecast, raw.source, metricAsOfISO);
    const previous = toMetric(raw.previous, raw.source, metricAsOfISO);

    const dateTimePart = hasExactTime ? `${time}:00` : "00:00:00";

    normalized.push({
      source: raw.source,
      region,
      currency: inferCurrency(region),
      titleRaw: raw.title,
      titleNormalized,
      categoryAF,
      dateBerlinISO: day,
      datetimeBerlinISO: `${day}T${dateTimePart}`,
      timeKind,
      timeHHMM: hasExactTime ? time : undefined,
      hasExactTime,
      isTopEvent: isTopEvent(titleNormalized),
      importance: raw.importance ?? "unknown",
      actual,
      forecast,
      previous,
      provenance: {
        fetchedAtISO: raw.fetchedAtISO,
        parserVersion,
        sourceUrlHash: raw.sourceUrlHash
      }
    });
  }

  return normalized;
};
