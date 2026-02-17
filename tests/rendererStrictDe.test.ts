import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { renderStrictWeeklyText } from "@/core/rendererStrictDe";
import type { GroupedRenderEvent, WeekRange } from "@/core/types";

const week: WeekRange = {
  weekStart: "2026-02-09",
  weekEnd: "2026-02-13",
  days: ["2026-02-09", "2026-02-10", "2026-02-11", "2026-02-12", "2026-02-13"]
};

const grouped: GroupedRenderEvent[] = [
  {
    region: "USA",
    day: "2026-02-09",
    timeKind: "exact",
    timeHHMM: "14:30",
    title: "CPI (YoY)",
    isTopEvent: true,
    datetimeBerlinISO: "2026-02-09T14:30:00"
  }
];

describe("renderStrictWeeklyText", () => {
  it("renders strict output byte-exact against golden snapshot", () => {
    const dayStatus = Object.fromEntries(
      week.days.map((day) => [
        day,
        { holidayTriggered: false, isWeekend: false, verificationFailed: false }
      ])
    );

    const result = renderStrictWeeklyText(week, grouped, dayStatus, true);
    const expected = readFileSync(path.join(process.cwd(), "tests/fixtures/golden/renderer_strict_weekly.txt"), "utf8");

    expect(result.renderedText).toBe(expected);
    expect(result.renderedText).toContain(" - **TOP-EVENT**");
  });

  it("renders exactly one day header per configured weekday in order", () => {
    const dayStatus = Object.fromEntries(
      week.days.map((day) => [
        day,
        { holidayTriggered: false, isWeekend: false, verificationFailed: false }
      ])
    );

    const result = renderStrictWeeklyText(week, [], dayStatus, true);
    const lines = result.renderedText.split("\n");
    const headers = lines.filter((line) => line.startsWith("### "));

    expect(headers).toHaveLength(5);
    expect(headers).toEqual([
      "### Montag, 09. Februar",
      "### Dienstag, 10. Februar",
      "### Mittwoch, 11. Februar",
      "### Donnerstag, 12. Februar",
      "### Freitag, 13. Februar"
    ]);
  });

  it("uses fixed region label mapping in rendered event lines", () => {
    const oneDayWeek: WeekRange = {
      weekStart: "2026-02-09",
      weekEnd: "2026-02-09",
      days: ["2026-02-09"]
    };
    const dayStatus = {
      "2026-02-09": { holidayTriggered: false, isWeekend: false, verificationFailed: false }
    };
    const events: GroupedRenderEvent[] = [
      { region: "USA", day: "2026-02-09", timeKind: "exact", timeHHMM: "08:00", title: "E1", isTopEvent: false, datetimeBerlinISO: "2026-02-09T08:00:00" },
      { region: "EZ", day: "2026-02-09", timeKind: "exact", timeHHMM: "08:01", title: "E2", isTopEvent: false, datetimeBerlinISO: "2026-02-09T08:01:00" },
      { region: "UK", day: "2026-02-09", timeKind: "exact", timeHHMM: "08:02", title: "E3", isTopEvent: false, datetimeBerlinISO: "2026-02-09T08:02:00" },
      { region: "JP", day: "2026-02-09", timeKind: "exact", timeHHMM: "08:03", title: "E4", isTopEvent: false, datetimeBerlinISO: "2026-02-09T08:03:00" },
      { region: "CH", day: "2026-02-09", timeKind: "exact", timeHHMM: "08:04", title: "E5", isTopEvent: false, datetimeBerlinISO: "2026-02-09T08:04:00" },
      { region: "CA", day: "2026-02-09", timeKind: "exact", timeHHMM: "08:05", title: "E6", isTopEvent: false, datetimeBerlinISO: "2026-02-09T08:05:00" },
      { region: "AU", day: "2026-02-09", timeKind: "exact", timeHHMM: "08:06", title: "E7", isTopEvent: false, datetimeBerlinISO: "2026-02-09T08:06:00" },
      { region: "NZ", day: "2026-02-09", timeKind: "exact", timeHHMM: "08:07", title: "E8", isTopEvent: false, datetimeBerlinISO: "2026-02-09T08:07:00" }
    ];

    const result = renderStrictWeeklyText(oneDayWeek, events, dayStatus, true);
    const lines = result.renderedText.split("\n");

    expect(lines).toContain("08:00 Uhr: USA E1");
    expect(lines).toContain("08:01 Uhr: Euro Zone E2");
    expect(lines).toContain("08:02 Uhr: United Kingdom E3");
    expect(lines).toContain("08:03 Uhr: Japan E4");
    expect(lines).toContain("08:04 Uhr: Switzerland E5");
    expect(lines).toContain("08:05 Uhr: Canada E6");
    expect(lines).toContain("08:06 Uhr: Australia E7");
    expect(lines).toContain("08:07 Uhr: New Zealand E8");
  });

  it("renders all-day events with canonical all-day line prefix", () => {
    const oneDayWeek: WeekRange = {
      weekStart: "2026-02-09",
      weekEnd: "2026-02-09",
      days: ["2026-02-09"]
    };
    const dayStatus = {
      "2026-02-09": { holidayTriggered: false, isWeekend: false, verificationFailed: false }
    };
    const events: GroupedRenderEvent[] = [
      {
        region: "USA",
        day: "2026-02-09",
        timeKind: "all_day",
        title: "Bank Holiday",
        isTopEvent: false,
        datetimeBerlinISO: "2026-02-09T00:00:00"
      }
    ];

    const result = renderStrictWeeklyText(oneDayWeek, events, dayStatus, true);
    expect(result.renderedText).toContain("All Day: USA Bank Holiday");
  });
});
