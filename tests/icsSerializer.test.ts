import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { deterministicDtstampForWeek, generateIcs } from "@/core/icsSerializer";
import type { EconomicEvent } from "@/core/types";

const sampleEvents: EconomicEvent[] = [
  {
    source: "investing",
    region: "USA",
    currency: "USD",
    titleRaw: "CPI (YoY)",
    titleNormalized: "cpi (yoy)",
    categoryAF: "B",
    datetimeBerlinISO: "2026-02-09T14:30:00",
    timeHHMM: "14:30",
    hasExactTime: true,
    isTopEvent: true,
    provenance: {
      fetchedAtISO: "2026-02-08T08:00:00Z",
      parserVersion: "v1.0.0"
    }
  }
];

describe("icsSerializer", () => {
  it("derives deterministic dtstamp from week start berlin midnight", () => {
    expect(deterministicDtstampForWeek("2026-02-09")).toBe("20260208T230000Z");
  });

  it("creates RFC-like ICS with required category and CRLF", () => {
    const ics = generateIcs(sampleEvents, "2026-02-09", "v1.0.0");
    const expected = readFileSync(path.join(process.cwd(), "tests/fixtures/golden/ics_single_event.ics"), "utf8");

    expect(ics).toBe(expected);
    expect(ics.includes("\r\n")).toBe(true);
    expect(ics).toContain("DTSTAMP:20260208T230000Z");
    expect(ics).toContain("BEGIN:VTIMEZONE");

    const vevents = ics.split("BEGIN:VEVENT").slice(1).map((chunk) => `BEGIN:VEVENT${chunk}`);
    expect(vevents.length).toBeGreaterThan(0);
    for (const event of vevents) {
      expect(event).toContain("CATEGORIES:Wirtschafts-Event");
    }
  });
});
