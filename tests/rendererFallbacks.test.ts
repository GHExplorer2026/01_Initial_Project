import { describe, expect, it } from "vitest";
import { NOTE_HOLIDAY, NOTE_NO_VERIFIED, NOTE_WEEKEND_OR_HOLIDAY } from "@/core/constants";
import { renderStrictWeeklyText } from "@/core/rendererStrictDe";
import type { DayStatus, WeekRange } from "@/core/types";

const renderSingleDay = (day: string, status: DayStatus, dataReliable: boolean): string => {
  const week: WeekRange = {
    weekStart: day,
    weekEnd: day,
    days: [day]
  };

  return renderStrictWeeklyText(week, [], { [day]: status }, dataReliable).renderedText;
};

describe("renderStrictWeeklyText fallback notes", () => {
  it("renders weekend note exactly", () => {
    const out = renderSingleDay(
      "2026-02-14",
      { holidayTriggered: false, isWeekend: true, verificationFailed: false },
      true
    );
    const lines = out.split("\n");
    expect(lines).toHaveLength(3);
    expect(lines[0]).toBe("📊 WOCHENAUSBLICK 14.02.2026 – 14.02.2026");
    expect(lines[1]).toBe("### Samstag, 14. Februar");
    expect(lines[2]).toBe(NOTE_WEEKEND_OR_HOLIDAY);
  });

  it("renders holiday note exactly", () => {
    const out = renderSingleDay(
      "2026-07-03",
      { holidayTriggered: true, isWeekend: false, verificationFailed: false },
      true
    );
    const lines = out.split("\n");
    expect(lines).toHaveLength(3);
    expect(lines[0]).toBe("📊 WOCHENAUSBLICK 03.07.2026 – 03.07.2026");
    expect(lines[1]).toBe("### Freitag, 03. Juli");
    expect(lines[2]).toBe(NOTE_HOLIDAY);
  });

  it("renders no-verified note when data is unreliable", () => {
    const out = renderSingleDay(
      "2026-02-10",
      { holidayTriggered: false, isWeekend: false, verificationFailed: true },
      false
    );
    const lines = out.split("\n");
    expect(lines).toHaveLength(3);
    expect(lines[0]).toBe("📊 WOCHENAUSBLICK 10.02.2026 – 10.02.2026");
    expect(lines[1]).toBe("### Dienstag, 10. Februar");
    expect(lines[2]).toBe(NOTE_NO_VERIFIED);
  });

  it("prioritizes weekend/holiday note when both flags are true", () => {
    const out = renderSingleDay(
      "2026-12-26",
      { holidayTriggered: true, isWeekend: true, verificationFailed: false },
      true
    );
    expect(out).toContain(NOTE_WEEKEND_OR_HOLIDAY);
    expect(out).not.toContain(NOTE_HOLIDAY);
  });
});
