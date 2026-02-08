import { describe, expect, it } from "vitest";
import { applyHolidayFilter } from "@/core/holidayEngine";
import type { EconomicEvent } from "@/core/types";

const baseEvent = (overrides: Partial<EconomicEvent>): EconomicEvent => ({
  source: "investing",
  region: "USA",
  currency: "USD",
  titleRaw: "CPI (YoY)",
  titleNormalized: "cpi (yoy)",
  categoryAF: "B",
  datetimeBerlinISO: "2026-07-03T14:30:00",
  timeHHMM: "14:30",
  hasExactTime: true,
  isTopEvent: true,
  provenance: {
    fetchedAtISO: "2026-07-01T08:00:00Z",
    parserVersion: "v1.0.0"
  },
  ...overrides
});

describe("applyHolidayFilter", () => {
  it("removes region events on holiday and marks holidayTriggered", () => {
    const events: EconomicEvent[] = [
      baseEvent({ region: "USA", currency: "USD", datetimeBerlinISO: "2026-07-03T14:30:00", titleRaw: "NFP" }),
      baseEvent({
        region: "UK",
        currency: "GBP",
        datetimeBerlinISO: "2026-07-03T09:00:00",
        titleRaw: "GDP (QoQ)",
        titleNormalized: "gdp (qoq)",
        categoryAF: "D"
      })
    ];

    const { filteredEvents, dayStatus } = applyHolidayFilter(events, ["2026-07-03"], ["USA", "UK"]);

    expect(filteredEvents).toHaveLength(1);
    expect(filteredEvents[0].region).toBe("UK");
    expect(dayStatus["2026-07-03"].holidayTriggered).toBe(true);
  });

  it("marks weekend days in dayStatus", () => {
    const { filteredEvents, dayStatus } = applyHolidayFilter([], ["2026-02-14"], ["USA"]);

    expect(filteredEvents).toHaveLength(0);
    expect(dayStatus["2026-02-14"].isWeekend).toBe(true);
  });
});
