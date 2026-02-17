import { describe, expect, it } from "vitest";

import { normalizeWeeklyResponse } from "@/app/weeklyResponse";

describe("weekly response normalizer", () => {
  it("keeps valid rendered text and metadata", () => {
    const normalized = normalizeWeeklyResponse({
      renderedText: "strict",
      meta: {
        sourceMode: "fixtures",
        sourcesUsed: ["investing", "tradingview"]
      }
    });

    expect(normalized).toEqual({
      renderedText: "strict",
      events: [],
      days: [],
      sourceMode: "fixtures",
      sourcesUsed: ["investing", "tradingview"]
    });
  });

  it("falls back to deterministic defaults when metadata is missing", () => {
    const normalized = normalizeWeeklyResponse({
      renderedText: "strict"
    });

    expect(normalized).toEqual({
      renderedText: "strict",
      events: [],
      days: [],
      sourceMode: null,
      sourcesUsed: []
    });
  });

  it("rejects malformed values and trims source entries", () => {
    const normalized = normalizeWeeklyResponse({
      renderedText: 123,
      meta: {
        sourceMode: "unknown",
        sourcesUsed: [" investing ", "", 42, "tradingview", "investing"]
      }
    });

    expect(normalized).toEqual({
      renderedText: "",
      events: [],
      days: [],
      sourceMode: null,
      sourcesUsed: ["investing", "tradingview"]
    });
  });

  it("sorts normalized source names for deterministic UI rendering", () => {
    const normalized = normalizeWeeklyResponse({
      renderedText: "strict",
      meta: {
        sourceMode: "live",
        sourcesUsed: ["tradingview", "investing", "tertiary:bls", "investing"]
      }
    });

    expect(normalized.sourcesUsed).toEqual(["investing", "tertiary:bls", "tradingview"]);
  });

  it("normalizes events/day records for table rendering", () => {
    const normalized = normalizeWeeklyResponse({
      renderedText: "strict",
      events: [
        {
          region: "CA",
          currency: "CAD",
          titleRaw: "CPI",
          dateBerlinISO: "2026-02-16",
          timeKind: "exact",
          timeHHMM: "14:30",
          importance: "medium",
          actual: { value: "2.1%" },
          forecast: { value: "2.0%" },
          previous: { value: "1.9%" },
          isTopEvent: true
        }
      ],
      days: [{ dateBerlinISO: "2026-02-16", dayHeader: "### Montag, 16. Februar", note: "Hinweis" }]
    });

    expect(normalized.events).toHaveLength(1);
    expect(normalized.events[0]).toMatchObject({
      region: "CA",
      currency: "CAD",
      timeKind: "exact",
      timeHHMM: "14:30",
      importance: "high",
      actual: "2.1%",
      forecast: "2.0%",
      previous: "1.9%"
    });
    expect(normalized.events[0].isTopEvent).toBe(true);
    expect(normalized.days).toEqual([{ dateBerlinISO: "2026-02-16", dayHeader: "### Montag, 16. Februar", note: "Hinweis" }]);
  });

  it("normalizes high importance events to TOP-EVENT in UI model", () => {
    const normalized = normalizeWeeklyResponse({
      events: [
        {
          region: "USA",
          currency: "USD",
          titleRaw: "Retail Sales",
          dateBerlinISO: "2026-02-16",
          timeKind: "exact",
          timeHHMM: "14:30",
          importance: "high",
          isTopEvent: false
        }
      ]
    });

    expect(normalized.events).toHaveLength(1);
    expect(normalized.events[0].importance).toBe("high");
    expect(normalized.events[0].isTopEvent).toBe(true);
  });
});
