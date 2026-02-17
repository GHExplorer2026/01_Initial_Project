import { CURRENCY_TO_REGION, type CurrencyCode, type RegionCode, type RawSourceEvent } from "@/core/types";
import { fetchWithTimeout, readFixtureEvents, stripHtml, toBerlinDateTime } from "@/server/sources/common";
import type { SourceFetchResult } from "@/server/sources/types";

const INVESTING_CALENDAR_SERVICE = "https://www.investing.com/economic-calendar/Service/getCalendarFilteredData";
const ALLOWED_CURRENCIES = new Set(Object.keys(CURRENCY_TO_REGION));

const INVESTING_COUNTRY_ID: Record<RegionCode, number> = {
  USA: 5,
  EZ: 72,
  UK: 4,
  JP: 35,
  CH: 6,
  CA: 39,
  AU: 26,
  NZ: 110
};

const toBody = (weekStart: string, weekEnd: string, regions: RegionCode[]): URLSearchParams => {
  const params = new URLSearchParams();
  for (const region of regions) {
    params.append("country[]", String(INVESTING_COUNTRY_ID[region]));
  }
  params.set("timeZone", "55");
  params.set("dateFrom", weekStart);
  params.set("dateTo", weekEnd);
  params.set("currentTab", "custom");
  params.set("limit_from", "0");
  return params;
};

const parseInvestingDateTime = (value: string): { date: string; time: string } | null => {
  const normalized = value.trim().replace(/\//g, "-").replace(" ", "T");
  const asUtc = new Date(`${normalized}Z`);
  if (Number.isNaN(asUtc.getTime())) {
    return null;
  }
  return toBerlinDateTime(asUtc);
};

const toImportance = (rowHtml: string): RawSourceEvent["importance"] => {
  const sentimentCell = rowHtml.match(/<td\b[^>]*class=(["'])[^"']*\bsentiment\b[^"']*\1[^>]*>([\s\S]*?)<\/td>/i)?.[2] ?? "";
  if (!sentimentCell) {
    return "unknown";
  }
  const iconCount = [...sentimentCell.matchAll(/<i\b[^>]*>/gi)].length;
  if (iconCount >= 3) {
    return "high";
  }
  if (iconCount === 2) {
    return "medium";
  }
  if (iconCount === 1) {
    return "low";
  }
  return "unknown";
};

const normalizeMetricValue = (value: string | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }
  const normalized = value.trim();
  if (!normalized || normalized === "-" || normalized === "—" || normalized.toLowerCase() === "n/a") {
    return undefined;
  }
  return normalized;
};

const extractTimeCell = (rowHtml: string): string => {
  const timeCell = rowHtml.match(/<td\b[^>]*class=(["'])[^"']*\btime\b[^"']*\1[^>]*>([\s\S]*?)<\/td>/i)?.[2] ?? "";
  const token = stripHtml(timeCell);
  if (/^all\s*day$/i.test(token)) {
    return "All Day";
  }
  if (/^([01]\d|2[0-3]):([0-5]\d)$/.test(token)) {
    return token;
  }
  return "";
};

const parseRows = (html: string): RawSourceEvent[] => {
  const rows = [...html.matchAll(/<tr\b[^>]*\bid=(["'])eventRowId_[^"']+\1[^>]*>[\s\S]*?<\/tr>/gi)];
  const out: RawSourceEvent[] = [];

  for (const [row] of rows) {
    const rawDateTime = row.match(/\bdata-event-datetime=(["'])([^"']+)\1/i)?.[2];
    const currencyCell = row.match(/<td\b[^>]*class=(["'])[^"']*\bflagCur\b[^"']*\1[^>]*>([\s\S]*?)<\/td>/i)?.[2];
    const currency = currencyCell ? stripHtml(currencyCell).toUpperCase().match(/\b([A-Z]{3})\b/)?.[1] : undefined;
    const eventCell = row.match(/<td\b[^>]*class=(["'])[^"']*\bevent\b[^"']*\1[^>]*>([\s\S]*?)<\/td>/i)?.[2];
    const titleRaw = eventCell?.match(/<a\b[^>]*>([\s\S]*?)<\/a>/i)?.[1] ?? eventCell;
    const actualRaw = row.match(/<td\b[^>]*class=(["'])[^"']*\bact\b[^"']*\1[^>]*>([\s\S]*?)<\/td>/i)?.[2];
    const forecastRaw = row.match(/<td\b[^>]*class=(["'])[^"']*\bfore\b[^"']*\1[^>]*>([\s\S]*?)<\/td>/i)?.[2];
    const previousRaw = row.match(/<td\b[^>]*class=(["'])[^"']*\bprev\b[^"']*\1[^>]*>([\s\S]*?)<\/td>/i)?.[2];

    if (!rawDateTime || !currency || !titleRaw || !ALLOWED_CURRENCIES.has(currency as CurrencyCode)) {
      continue;
    }

    const berlin = parseInvestingDateTime(rawDateTime);
    if (!berlin) {
      continue;
    }

    const title = stripHtml(titleRaw);
    if (!title) {
      continue;
    }

    const parsedTime = extractTimeCell(row);
    const time = parsedTime || berlin.time;

    out.push({
      source: "investing",
      currency: currency as CurrencyCode,
      title,
      date: berlin.date,
      time,
      timeKind: time === "All Day" ? "all_day" : "exact",
      importance: toImportance(row),
      actual: normalizeMetricValue(actualRaw ? stripHtml(actualRaw) : undefined),
      forecast: normalizeMetricValue(forecastRaw ? stripHtml(forecastRaw) : undefined),
      previous: normalizeMetricValue(previousRaw ? stripHtml(previousRaw) : undefined),
      fetchedAtISO: new Date().toISOString()
    });
  }

  return out;
};

export const fetchInvestingFixtureEvents = async (
  weekStart: string,
  weekEnd: string,
  regions: RegionCode[]
): Promise<SourceFetchResult> => readFixtureEvents("investing.json", weekStart, weekEnd, regions);

export const fetchInvestingLiveEvents = async (
  weekStart: string,
  weekEnd: string,
  regions: RegionCode[]
): Promise<SourceFetchResult> => {
  try {
    const response = await fetchWithTimeout(INVESTING_CALENDAR_SERVICE, {
      method: "POST",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: toBody(weekStart, weekEnd, regions)
    });

    if (!response.ok) {
      return {
        ok: false,
        events: [],
        error: `investing live request failed with ${response.status}`
      };
    }

    const payload = (await response.json()) as { data?: string };
    const html = payload.data ?? "";
    const events = parseRows(html);

    return {
      ok: true,
      events
    };
  } catch (error) {
    return {
      ok: false,
      events: [],
      error: error instanceof Error ? error.message : "investing live fetch error"
    };
  }
};
