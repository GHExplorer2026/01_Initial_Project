import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/widget-feed/route";
import type { WeeklyOutput } from "@/core/types";
import { generateWeeklyOutlook } from "@/server/orchestrator";

vi.mock("@/server/orchestrator", () => ({
  generateWeeklyOutlook: vi.fn()
}));

const mockedGenerateWeeklyOutlook = vi.mocked(generateWeeklyOutlook);

const buildWeeklyOutput = (events: WeeklyOutput["events"]): WeeklyOutput => ({
  renderedText: "STRICT",
  events,
  days: [],
  meta: {
    parserVersion: "v1.0.0",
    generatedAtISO: "2026-02-10T10:00:00.000Z",
    weekStartBerlinISO: "2026-02-09T00:00:00+01:00",
    weekEndBerlinISO: "2026-02-13T23:59:59+01:00",
    sourceMode: "fixtures",
    sourcesUsed: ["investing", "tradingview"]
  },
  icsPayload: "ICS"
});

describe("GET /api/widget-feed", () => {
  beforeEach(() => {
    mockedGenerateWeeklyOutlook.mockReset();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-10T10:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns contract payload using regions as primary parameter", async () => {
    mockedGenerateWeeklyOutlook.mockResolvedValue(
      buildWeeklyOutput([
        {
          source: "investing",
          region: "USA",
          currency: "USD",
          titleRaw: "CPI (YoY)",
          titleNormalized: "cpi yoy",
          categoryAF: "B",
          dateBerlinISO: "2026-02-10",
          datetimeBerlinISO: "2026-02-10T15:30:00",
          timeKind: "exact",
          timeHHMM: "15:30",
          hasExactTime: true,
          isTopEvent: true,
          importance: "high",
          actual: { value: "3.1%", source: "investing", asOfISO: "2026-02-10T08:00:00.000Z" },
          forecast: { value: "3.0%", source: "investing", asOfISO: "2026-02-10T08:00:00.000Z" },
          previous: { value: "2.9%", source: "investing", asOfISO: "2026-02-10T08:00:00.000Z" },
          provenance: { fetchedAtISO: "2026-02-10T08:00:00.000Z", parserVersion: "v1.0.0" }
        }
      ])
    );

    const response = await GET(new Request("http://localhost/api/widget-feed?regions=USA,EZ&countries=USD,EUR&datePreset=today"));
    const payload = (await response.json()) as {
      meta: {
        feedVersion: string;
        timezoneReference: string;
        parserVersion: string;
        sourceMode: string;
        sourcesUsed: string[];
      };
      events: Array<Record<string, unknown>>;
    };

    expect(response.status).toBe(200);
    expect(mockedGenerateWeeklyOutlook).toHaveBeenCalledTimes(1);
    expect(mockedGenerateWeeklyOutlook).toHaveBeenCalledWith({ regions: ["USA", "EZ"], now: expect.any(Date) });

    expect(payload.meta.feedVersion).toBe("1.1");
    expect(payload.meta.timezoneReference).toBe("UTC");
    expect(payload.meta.parserVersion).toBe("v1.0.0");
    expect(payload.meta.sourceMode).toBe("fixtures");
    expect(payload.meta.sourcesUsed).toEqual(["investing", "tradingview"]);
    expect(payload.events).toHaveLength(1);
    expect(payload.events[0]).toMatchObject({
      region: "USA",
      countryLabel: "USA",
      currency: "USD",
      titleRaw: "CPI (YoY)",
      importance: "high",
      isTopEvent: true,
      actual: "3.1%",
      forecast: "3.0%",
      previous: "2.9%",
      source: "investing",
      timeKind: "exact"
    });
    expect(payload.events[0].eventId).toBeTypeOf("string");
    expect(payload.events[0].datetimeUTC).toBeTypeOf("string");
  });

  it("filters out past exact-time events when datePreset is not yesterday", async () => {
    mockedGenerateWeeklyOutlook.mockResolvedValue(
      buildWeeklyOutput([
        {
          source: "investing",
          region: "USA",
          currency: "USD",
          titleRaw: "Old Event",
          titleNormalized: "old event",
          categoryAF: "B",
          dateBerlinISO: "2026-02-10",
          datetimeBerlinISO: "2026-02-10T09:00:00",
          timeKind: "exact",
          timeHHMM: "09:00",
          hasExactTime: true,
          isTopEvent: false,
          importance: "low",
          provenance: { fetchedAtISO: "2026-02-10T08:00:00.000Z", parserVersion: "v1.0.0" }
        },
        {
          source: "investing",
          region: "USA",
          currency: "USD",
          titleRaw: "Future Event",
          titleNormalized: "future event",
          categoryAF: "B",
          dateBerlinISO: "2026-02-10",
          datetimeBerlinISO: "2026-02-10T15:00:00",
          timeKind: "exact",
          timeHHMM: "15:00",
          hasExactTime: true,
          isTopEvent: false,
          importance: "low",
          provenance: { fetchedAtISO: "2026-02-10T08:00:00.000Z", parserVersion: "v1.0.0" }
        }
      ])
    );

    const response = await GET(new Request("http://localhost/api/widget-feed?regions=USA&datePreset=today"));
    const payload = (await response.json()) as { events: Array<{ titleRaw: string }> };

    expect(response.status).toBe(200);
    expect(payload.events.map((event) => event.titleRaw)).toEqual(["Future Event"]);
  });

  it("keeps yesterday events when datePreset=yesterday", async () => {
    mockedGenerateWeeklyOutlook.mockResolvedValue(
      buildWeeklyOutput([
        {
          source: "investing",
          region: "USA",
          currency: "USD",
          titleRaw: "Yesterday Event",
          titleNormalized: "yesterday event",
          categoryAF: "B",
          dateBerlinISO: "2026-02-09",
          datetimeBerlinISO: "2026-02-09T09:00:00",
          timeKind: "exact",
          timeHHMM: "09:00",
          hasExactTime: true,
          isTopEvent: false,
          importance: "low",
          provenance: { fetchedAtISO: "2026-02-10T08:00:00.000Z", parserVersion: "v1.0.0" }
        }
      ])
    );

    const response = await GET(new Request("http://localhost/api/widget-feed?regions=USA&datePreset=yesterday"));
    const payload = (await response.json()) as { events: Array<{ titleRaw: string }> };

    expect(response.status).toBe(200);
    expect(payload.events.map((event) => event.titleRaw)).toEqual(["Yesterday Event"]);
  });

  it("applies currencies and importance filters", async () => {
    mockedGenerateWeeklyOutlook.mockResolvedValue(
      buildWeeklyOutput([
        {
          source: "investing",
          region: "USA",
          currency: "USD",
          titleRaw: "High USD",
          titleNormalized: "high usd",
          categoryAF: "B",
          dateBerlinISO: "2026-02-10",
          datetimeBerlinISO: "2026-02-10T15:00:00",
          timeKind: "exact",
          timeHHMM: "15:00",
          hasExactTime: true,
          isTopEvent: true,
          importance: "high",
          provenance: { fetchedAtISO: "2026-02-10T08:00:00.000Z", parserVersion: "v1.0.0" }
        },
        {
          source: "investing",
          region: "EZ",
          currency: "EUR",
          titleRaw: "Medium EUR",
          titleNormalized: "medium eur",
          categoryAF: "D",
          dateBerlinISO: "2026-02-10",
          datetimeBerlinISO: "2026-02-10T16:00:00",
          timeKind: "exact",
          timeHHMM: "16:00",
          hasExactTime: true,
          isTopEvent: false,
          importance: "medium",
          provenance: { fetchedAtISO: "2026-02-10T08:00:00.000Z", parserVersion: "v1.0.0" }
        }
      ])
    );

    const response = await GET(
      new Request("http://localhost/api/widget-feed?regions=USA,EZ&datePreset=today&currencies=USD&importance=high")
    );
    const payload = (await response.json()) as { events: Array<{ titleRaw: string }> };

    expect(response.status).toBe(200);
    expect(payload.events.map((event) => event.titleRaw)).toEqual(["High USD"]);
  });

  it("returns 400 on regions/countries conflict", async () => {
    const response = await GET(new Request("http://localhost/api/widget-feed?regions=USA&countries=EUR"));
    const payload = (await response.json()) as { error: string };

    expect(response.status).toBe(400);
    expect(payload.error).toBe("regions and countries parameters conflict");
    expect(mockedGenerateWeeklyOutlook).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid custom range", async () => {
    const response = await GET(new Request("http://localhost/api/widget-feed?regions=USA&datePreset=custom&customFrom=2026-02-11"));
    const payload = (await response.json()) as { error: string };

    expect(response.status).toBe(400);
    expect(payload.error).toBe("invalid custom date range");
    expect(mockedGenerateWeeklyOutlook).not.toHaveBeenCalled();
  });

  it("returns 500 when orchestration fails", async () => {
    mockedGenerateWeeklyOutlook.mockRejectedValue(new Error("boom"));

    const response = await GET(new Request("http://localhost/api/widget-feed?regions=USA"));
    const payload = (await response.json()) as { error: string };

    expect(response.status).toBe(500);
    expect(payload.error).toBe("failed to generate widget feed");
  });
});
