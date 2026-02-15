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
  params.set("timeFilter", "timeOnly");
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

const parseRows = (html: string): RawSourceEvent[] => {
  const rows = [...html.matchAll(/<tr\b[^>]*\bid=(["'])eventRowId_[^"']+\1[^>]*>[\s\S]*?<\/tr>/gi)];
  const out: RawSourceEvent[] = [];

  for (const [row] of rows) {
    const rawDateTime = row.match(/\bdata-event-datetime=(["'])([^"']+)\1/i)?.[2];
    const currencyCell = row.match(/<td\b[^>]*class=(["'])[^"']*\bflagCur\b[^"']*\1[^>]*>([\s\S]*?)<\/td>/i)?.[2];
    const currency = currencyCell ? stripHtml(currencyCell).toUpperCase().match(/\b([A-Z]{3})\b/)?.[1] : undefined;
    const eventCell = row.match(/<td\b[^>]*class=(["'])[^"']*\bevent\b[^"']*\1[^>]*>([\s\S]*?)<\/td>/i)?.[2];
    const titleRaw = eventCell?.match(/<a\b[^>]*>([\s\S]*?)<\/a>/i)?.[1] ?? eventCell;

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

    out.push({
      source: "investing",
      currency: currency as CurrencyCode,
      title,
      date: berlin.date,
      time: berlin.time,
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
