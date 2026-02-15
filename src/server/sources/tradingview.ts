import { CURRENCY_TO_REGION, type CurrencyCode, type RegionCode, type RawSourceEvent } from "@/core/types";
import { fetchWithTimeout, readFixtureEvents, toBerlinDateTime } from "@/server/sources/common";
import type { SourceFetchResult } from "@/server/sources/types";

const TRADINGVIEW_ECONOMIC_EVENTS = "https://economic-calendar.tradingview.com/events";
const ALLOWED_CURRENCIES = new Set(Object.keys(CURRENCY_TO_REGION));

type TradingViewEvent = {
  title?: string;
  currency?: string;
  date?: string | number;
};

const buildQuery = (weekStart: string, weekEnd: string): URLSearchParams => {
  const params = new URLSearchParams();
  params.set("from", `${weekStart}T00:00:00.000Z`);
  params.set("to", `${weekEnd}T23:59:59.999Z`);
  return params;
};

const parseTradingViewDate = (value: string | number): Date | null => {
  if (typeof value === "number") {
    const epochMs = value < 1_000_000_000_000 ? value * 1000 : value;
    const asDate = new Date(epochMs);
    return Number.isNaN(asDate.getTime()) ? null : asDate;
  }

  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  if (/^\d+$/.test(normalized)) {
    const numeric = Number(normalized);
    if (!Number.isFinite(numeric)) {
      return null;
    }
    const epochMs = numeric < 1_000_000_000_000 ? numeric * 1000 : numeric;
    const asDate = new Date(epochMs);
    return Number.isNaN(asDate.getTime()) ? null : asDate;
  }

  const asDate = new Date(normalized);
  return Number.isNaN(asDate.getTime()) ? null : asDate;
};

const parseTradingViewEvent = (event: TradingViewEvent): RawSourceEvent | null => {
  const title = event.title?.trim();
  const currency = event.currency?.trim().toUpperCase();

  if (!title || !currency || !event.date || !ALLOWED_CURRENCIES.has(currency)) {
    return null;
  }

  const asUtc = parseTradingViewDate(event.date);
  if (!asUtc) {
    return null;
  }

  const berlin = toBerlinDateTime(asUtc);

  return {
    source: "tradingview",
    currency: currency as CurrencyCode,
    title,
    date: berlin.date,
    time: berlin.time,
    fetchedAtISO: new Date().toISOString()
  };
};

export const fetchTradingViewFixtureEvents = async (
  weekStart: string,
  weekEnd: string,
  regions: RegionCode[]
): Promise<SourceFetchResult> => readFixtureEvents("tradingview.json", weekStart, weekEnd, regions);

export const fetchTradingViewLiveEvents = async (
  weekStart: string,
  weekEnd: string,
  _regions: RegionCode[]
): Promise<SourceFetchResult> => {
  void _regions;

  try {
    const response = await fetchWithTimeout(`${TRADINGVIEW_ECONOMIC_EVENTS}?${buildQuery(weekStart, weekEnd).toString()}`, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Referer: "https://www.tradingview.com/economic-calendar/",
        Origin: "https://www.tradingview.com",
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      return {
        ok: false,
        events: [],
        error: `tradingview live request failed with ${response.status}`
      };
    }

    const payload = (await response.json()) as { status?: string; result?: TradingViewEvent[] };
    if (payload.status !== "ok") {
      return {
        ok: false,
        events: [],
        error: "tradingview live response status is not ok"
      };
    }

    const events = (payload.result ?? [])
      .map((entry) => parseTradingViewEvent(entry))
      .filter((entry): entry is RawSourceEvent => entry !== null);

    return {
      ok: true,
      events
    };
  } catch (error) {
    return {
      ok: false,
      events: [],
      error: error instanceof Error ? error.message : "tradingview live fetch error"
    };
  }
};
