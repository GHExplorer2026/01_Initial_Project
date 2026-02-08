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
    expect(out).toContain(NOTE_WEEKEND_OR_HOLIDAY);
  });

  it("renders holiday note exactly", () => {
    const out = renderSingleDay(
      "2026-07-03",
      { holidayTriggered: true, isWeekend: false, verificationFailed: false },
      true
    );
    expect(out).toContain(NOTE_HOLIDAY);
  });

  it("renders no-verified note when data is unreliable", () => {
    const out = renderSingleDay(
      "2026-02-10",
      { holidayTriggered: false, isWeekend: false, verificationFailed: true },
      false
    );
    expect(out).toContain(NOTE_NO_VERIFIED);
  });
});
