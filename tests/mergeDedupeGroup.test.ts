import { describe, expect, it } from "vitest";
import { dedupeEvents, groupForRendering } from "@/core/dedupeGroup";
import { mergeByPriority } from "@/core/merge";
import type { EconomicEvent } from "@/core/types";

const event = (overrides: Partial<EconomicEvent>): EconomicEvent => ({
  source: "investing",
  region: "USA",
  currency: "USD",
  titleRaw: "CPI (YoY)",
  titleNormalized: "cpi (yoy)",
  categoryAF: "B",
  dateBerlinISO: "2026-02-09",
  datetimeBerlinISO: "2026-02-09T14:30:00",
  timeKind: "exact",
  timeHHMM: "14:30",
  hasExactTime: true,
  isTopEvent: true,
  importance: "high",
  provenance: {
    fetchedAtISO: "2026-02-08T08:00:00Z",
    parserVersion: "v1.0.0"
  },
  ...overrides
});

describe("mergeByPriority", () => {
  it("prefers investing over tradingview and tertiary for the same conflict key", () => {
    const merged = mergeByPriority([
      event({ source: "tertiary:bls" }),
      event({ source: "tradingview" }),
      event({ source: "investing" })
    ]);

    expect(merged).toHaveLength(1);
    expect(merged[0].source).toBe("investing");
  });

  it("uses parserVersion as tie-breaker for same source priority", () => {
    const merged = mergeByPriority([
      event({ source: "tertiary:bea", provenance: { fetchedAtISO: "x", parserVersion: "v1.0.0" } }),
      event({ source: "tertiary:ons", provenance: { fetchedAtISO: "x", parserVersion: "v1.1.0" } })
    ]);

    expect(merged).toHaveLength(1);
    expect(merged[0].source).toBe("tertiary:ons");
    expect(merged[0].provenance.parserVersion).toBe("v1.1.0");
  });
});

describe("dedupeEvents", () => {
  it("removes exact duplicates by region + datetime + normalized title", () => {
    const input = [
      event({ source: "investing" }),
      event({ source: "tradingview" }),
      event({ titleRaw: "GDP (QoQ)", titleNormalized: "gdp (qoq)", categoryAF: "D" })
    ];

    const out = dedupeEvents(input);
    expect(out).toHaveLength(2);
    expect(out.map((e) => e.titleNormalized)).toEqual(["cpi (yoy)", "gdp (qoq)"]);
  });
});

describe("groupForRendering", () => {
  it("groups same region/time lines, sorts titles with slash and preserves top-event when any child is top", () => {
    const grouped = groupForRendering([
      event({ titleRaw: "NFP", titleNormalized: "nfp", categoryAF: "C", isTopEvent: true }),
      event({ titleRaw: "ISM Manufacturing PMI", titleNormalized: "ism manufacturing pmi", categoryAF: "D", isTopEvent: true }),
      event({
        region: "EZ",
        currency: "EUR",
        titleRaw: "GDP (QoQ)",
        titleNormalized: "gdp (qoq)",
        categoryAF: "D",
        datetimeBerlinISO: "2026-02-09T11:00:00",
        timeHHMM: "11:00"
      })
    ]);

    expect(grouped).toHaveLength(2);
    expect(grouped[0].region).toBe("EZ");
    expect(grouped[1].region).toBe("USA");
    expect(grouped[1].title).toBe("ISM Manufacturing PMI / NFP");
    expect(grouped[1].isTopEvent).toBe(true);
  });

  it("uses REGION_ORDER as tie-breaker when datetime is identical", () => {
    const grouped = groupForRendering([
      event({
        region: "JP",
        currency: "JPY",
        titleRaw: "BoJ Rate Decision",
        titleNormalized: "boj rate decision",
        categoryAF: "A",
        datetimeBerlinISO: "2026-02-09T09:00:00",
        timeHHMM: "09:00"
      }),
      event({
        region: "EZ",
        currency: "EUR",
        titleRaw: "GDP (QoQ)",
        titleNormalized: "gdp (qoq)",
        categoryAF: "D",
        datetimeBerlinISO: "2026-02-09T09:00:00",
        timeHHMM: "09:00"
      }),
      event({
        region: "USA",
        currency: "USD",
        titleRaw: "CPI (YoY)",
        titleNormalized: "cpi (yoy)",
        categoryAF: "B",
        datetimeBerlinISO: "2026-02-09T09:00:00",
        timeHHMM: "09:00"
      })
    ]);

    expect(grouped.map((line) => line.region)).toEqual(["USA", "EZ", "JP"]);
  });
});
