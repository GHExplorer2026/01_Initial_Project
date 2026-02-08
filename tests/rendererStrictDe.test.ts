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
});
