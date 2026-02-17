import { TOP_EVENT_SUFFIX } from "@/core/constants";
import type { WeeklyDay, WeeklyEvent } from "@/app/weeklyResponse";

export type CalendarTableRow = {
  dateTime: string;
  currency: string;
  event: string;
  importance: string;
  actual: string;
  forecast: string;
  previous: string;
};

export type CalendarTableDay = {
  dateBerlinISO: string;
  dayHeader: string;
  note?: string;
  rows: CalendarTableRow[];
};

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  timeZone: "Europe/Berlin",
  day: "2-digit",
  month: "2-digit",
  year: "numeric"
});

const metricOrDash = (value: string | undefined): string => value ?? "—";

const importanceToDisplay = (value: WeeklyEvent["importance"]): string => {
  if (value === "high") {
    return "★★★";
  }
  if (value === "medium") {
    return "★★☆";
  }
  if (value === "low") {
    return "★☆☆";
  }
  return "—";
};

const formatDateTime = (event: WeeklyEvent): string => {
  const date = new Date(`${event.dateBerlinISO}T00:00:00Z`);
  const dateDisplay = dateFormatter.format(date);
  if (event.timeKind === "all_day") {
    return `${dateDisplay}, All Day`;
  }
  return `${dateDisplay}, ${event.timeHHMM ?? "00:00"}`;
};

const sortEvents = (events: WeeklyEvent[]): WeeklyEvent[] =>
  [...events].sort((a, b) => {
    const dayDelta = a.dateBerlinISO.localeCompare(b.dateBerlinISO);
    if (dayDelta !== 0) {
      return dayDelta;
    }
    const aRank = a.timeKind === "all_day" ? 0 : 1;
    const bRank = b.timeKind === "all_day" ? 0 : 1;
    if (aRank !== bRank) {
      return aRank - bRank;
    }
    const aTime = a.timeHHMM ?? "";
    const bTime = b.timeHHMM ?? "";
    const timeDelta = aTime.localeCompare(bTime);
    if (timeDelta !== 0) {
      return timeDelta;
    }
    const currencyDelta = a.currency.localeCompare(b.currency);
    if (currencyDelta !== 0) {
      return currencyDelta;
    }
    return a.titleRaw.localeCompare(b.titleRaw, "de-DE");
  });

const toRow = (event: WeeklyEvent): CalendarTableRow => ({
  dateTime: formatDateTime(event),
  currency: event.currency,
  event: `${event.titleRaw}${event.isTopEvent ? TOP_EVENT_SUFFIX : ""}`,
  importance: importanceToDisplay(event.importance),
  actual: metricOrDash(event.actual),
  forecast: metricOrDash(event.forecast),
  previous: metricOrDash(event.previous)
});

export const buildCalendarTableDays = (days: WeeklyDay[], events: WeeklyEvent[]): CalendarTableDay[] => {
  const rowsByDay = new Map<string, CalendarTableRow[]>();
  for (const event of sortEvents(events)) {
    const rows = rowsByDay.get(event.dateBerlinISO) ?? [];
    rows.push(toRow(event));
    rowsByDay.set(event.dateBerlinISO, rows);
  }

  return days.map((day) => ({
    dateBerlinISO: day.dateBerlinISO,
    dayHeader: day.dayHeader,
    note: day.note,
    rows: rowsByDay.get(day.dateBerlinISO) ?? []
  }));
};
