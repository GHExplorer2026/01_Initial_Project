import { NOTE_HOLIDAY, NOTE_NO_VERIFIED, NOTE_WEEKEND_OR_HOLIDAY, TOP_EVENT_SUFFIX } from "@/core/constants";
import { REGION_LABELS, type DayStatus, type GroupedRenderEvent, type RenderDay, type WeekRange } from "@/core/types";

const toDate = (ymd: string): Date => new Date(`${ymd}T00:00:00Z`);

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  timeZone: "Europe/Berlin",
  day: "2-digit",
  month: "2-digit",
  year: "numeric"
});

const dayHeaderFormatter = new Intl.DateTimeFormat("de-DE", {
  timeZone: "Europe/Berlin",
  weekday: "long",
  day: "2-digit",
  month: "long"
});

const monthYearFormatter = new Intl.DateTimeFormat("de-DE", {
  timeZone: "Europe/Berlin",
  month: "long",
  year: "numeric"
});

const capitalize = (value: string): string => `${value.charAt(0).toUpperCase()}${value.slice(1)}`;

const formatDateRange = (date: Date): string => dateFormatter.format(date);

const formatDayHeader = (date: Date): string => {
  const [weekdayRaw, rest] = dayHeaderFormatter.format(date).split(", ");
  return `### ${capitalize(weekdayRaw)}, ${rest}`;
};

const pickNote = (status: DayStatus): string => {
  if (status.isWeekend) {
    return NOTE_WEEKEND_OR_HOLIDAY;
  }
  if (status.holidayTriggered) {
    return NOTE_HOLIDAY;
  }
  return NOTE_NO_VERIFIED;
};

export const renderStrictWeeklyText = (
  week: WeekRange,
  groupedEvents: GroupedRenderEvent[],
  dayStatus: Record<string, DayStatus>,
  dataReliable: boolean
): { renderedText: string; days: RenderDay[] } => {
  const weekStartDate = toDate(week.weekStart);
  const weekEndDate = toDate(week.weekEnd);
  const monthYear = monthYearFormatter.format(weekStartDate);

  const lines: string[] = [];
  lines.push(`📊 WOCHENAUSBLICK ${formatDateRange(weekStartDate)} – ${formatDateRange(weekEndDate)} ${monthYear}`);

  const days: RenderDay[] = [];

  for (const day of week.days) {
    const header = formatDayHeader(toDate(day));
    lines.push(header);

    const dayLines = groupedEvents
      .filter((event) => event.day === day)
      .map((event) => `${event.timeHHMM} Uhr: ${REGION_LABELS[event.region]} ${event.title}${event.isTopEvent ? TOP_EVENT_SUFFIX : ""}`);

    if (dayLines.length === 0) {
      const status = dayStatus[day] ?? {
        holidayTriggered: false,
        isWeekend: false,
        verificationFailed: !dataReliable
      };
      const note = !dataReliable ? NOTE_NO_VERIFIED : pickNote(status);
      lines.push(note);
      days.push({ dayHeader: header, note });
      continue;
    }

    lines.push(...dayLines);
    days.push({ dayHeader: header, lines: dayLines });
  }

  return {
    renderedText: `${lines.join("\n")}`,
    days
  };
};
