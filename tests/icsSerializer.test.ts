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
    expect(deterministicDtstampForWeek("2026-03-30")).toBe("20260329T220000Z");
    expect(deterministicDtstampForWeek("2026-07-06")).toBe("20260705T220000Z");
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

  it("keeps VEVENT mandatory field order and CRLF-only encoding for multi-event output", () => {
    const ics = generateIcs(
      [
        ...sampleEvents,
        {
          ...sampleEvents[0],
          region: "EZ",
          currency: "EUR",
          titleRaw:
            "Gross Domestic Product Final Reading with Extended Description for Folding Validation in Output",
          titleNormalized:
            "gross domestic product final reading with extended description for folding validation in output",
          categoryAF: "D",
          datetimeBerlinISO: "2026-02-09T15:00:00",
          timeHHMM: "15:00"
        }
      ],
      "2026-02-09",
      "v1.0.0"
    );

    expect(ics.endsWith("\r\n")).toBe(true);
    expect(ics).not.toMatch(/(^|[^\r])\n/);

    const lines = ics.split("\r\n").filter((line) => line.length > 0);
    for (const line of lines) {
      expect(Buffer.byteLength(line, "utf8")).toBeLessThanOrEqual(75);
    }

    const vevents = ics.split("BEGIN:VEVENT\r\n").slice(1).map((chunk) => `BEGIN:VEVENT\r\n${chunk}`);
    expect(vevents).toHaveLength(2);
    for (const event of vevents) {
      expect(event).toContain("\r\nCATEGORIES:Wirtschafts-Event\r\n");
      expect(event).toContain("\r\nDTSTAMP:20260208T230000Z\r\n");
      expect(event).toMatch(
        /BEGIN:VEVENT\r\nUID:[^\r\n]+\r\nDTSTAMP:[^\r\n]+\r\nDTSTART;TZID=Europe\/Berlin:[^\r\n]+\r\nDTEND;TZID=Europe\/Berlin:[^\r\n]+\r\nSUMMARY:/
      );
    }
  });

  it("is byte-deterministic across input order and ties UID to parserVersion", () => {
    const secondEvent: EconomicEvent = {
      ...sampleEvents[0],
      region: "EZ",
      currency: "EUR",
      titleRaw: "GDP (QoQ)",
      titleNormalized: "gdp (qoq)",
      categoryAF: "D",
      datetimeBerlinISO: "2026-02-10T11:00:00",
      timeHHMM: "11:00"
    };

    const ordered = generateIcs([sampleEvents[0], secondEvent], "2026-02-09", "v1.0.0");
    const reversed = generateIcs([secondEvent, sampleEvents[0]], "2026-02-09", "v1.0.0");
    expect(ordered).toBe(reversed);

    const withOtherParserVersion = generateIcs([sampleEvents[0], secondEvent], "2026-02-09", "v1.0.1");
    const uidV100 = [...ordered.matchAll(/UID:([^\r\n]+)/g)].map((m) => m[1]);
    const uidV101 = [...withOtherParserVersion.matchAll(/UID:([^\r\n]+)/g)].map((m) => m[1]);

    expect(uidV100).toHaveLength(2);
    expect(uidV101).toHaveLength(2);
    expect(uidV101).not.toEqual(uidV100);
    expect(withOtherParserVersion).toContain("DTSTAMP:20260208T230000Z");
  });

  it("rolls DTEND across midnight by 15 minutes in local Berlin time", () => {
    const nearMidnight: EconomicEvent = {
      ...sampleEvents[0],
      datetimeBerlinISO: "2026-02-09T23:55:00",
      timeHHMM: "23:55"
    };

    const ics = generateIcs([nearMidnight], "2026-02-09", "v1.0.0");
    expect(ics).toContain("DTSTART;TZID=Europe/Berlin:20260209T235500");
    expect(ics).toContain("DTEND;TZID=Europe/Berlin:20260210T001000");
  });
});
