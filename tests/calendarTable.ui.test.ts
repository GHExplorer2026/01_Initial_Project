import { describe, expect, it } from "vitest";
import { buildCalendarTableDays } from "@/app/calendarTable";
import type { WeeklyDay, WeeklyEvent } from "@/app/weeklyResponse";

describe("calendar table view model", () => {
  it("builds Date + Time rows with weekday grouping and deterministic ordering", () => {
    const days: WeeklyDay[] = [
      { dateBerlinISO: "2026-02-16", dayHeader: "### Montag, 16. Februar" },
      { dateBerlinISO: "2026-02-17", dayHeader: "### Dienstag, 17. Februar", note: "Hinweis: Keine verifizierten Events gefunden." }
    ];
    const events: WeeklyEvent[] = [
      {
        region: "USA",
        currency: "USD",
        titleRaw: "CPI (YoY)",
        dateBerlinISO: "2026-02-16",
        timeKind: "exact",
        timeHHMM: "14:30",
        importance: "high",
        actual: "2.1%",
        forecast: "2.0%",
        previous: "1.9%",
        isTopEvent: true
      },
      {
        region: "USA",
        currency: "USD",
        titleRaw: "Bank Holiday",
        dateBerlinISO: "2026-02-16",
        timeKind: "all_day",
        importance: "unknown",
        isTopEvent: false
      }
    ];

    const table = buildCalendarTableDays(days, events);
    expect(table).toHaveLength(2);
    expect(table[0].rows).toHaveLength(2);
    expect(table[0].rows[0]).toMatchObject({
      dateTime: "16.02.2026, All Day",
      currency: "USD",
      event: "Bank Holiday",
      importance: "—",
      actual: "—",
      forecast: "—",
      previous: "—"
    });
    expect(table[0].rows[1]).toMatchObject({
      dateTime: "16.02.2026, 14:30",
      event: "CPI (YoY) - **TOP-EVENT**",
      importance: "★★★",
      actual: "2.1%",
      forecast: "2.0%",
      previous: "1.9%"
    });
    expect(table[1].rows).toEqual([]);
    expect(table[1].note).toBe("Hinweis: Keine verifizierten Events gefunden.");
  });

  it("treats high importance as TOP-EVENT in event label and stars", () => {
    const days: WeeklyDay[] = [{ dateBerlinISO: "2026-02-16", dayHeader: "### Montag, 16. Februar" }];
    const events: WeeklyEvent[] = [
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
    ];

    const table = buildCalendarTableDays(days, events);
    expect(table[0].rows[0].event).toBe("Retail Sales - **TOP-EVENT**");
    expect(table[0].rows[0].importance).toBe("★★★");
  });
});
