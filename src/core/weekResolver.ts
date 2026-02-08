import type { WeekRange } from "@/core/types";

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6
};

const formatYmd = (date: Date): string => {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const addDaysUtc = (date: Date, days: number): Date => {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

const getBerlinParts = (now: Date) => {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short"
  });

  const parts = fmt.formatToParts(now);
  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const day = Number(parts.find((p) => p.type === "day")?.value);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Mon";

  return {
    year,
    month,
    day,
    weekdayIndex: WEEKDAY_INDEX[weekday] ?? 1
  };
};

export const resolveWeekInBerlin = (now = new Date()): WeekRange => {
  const berlin = getBerlinParts(now);
  const berlinDateUtc = new Date(Date.UTC(berlin.year, berlin.month - 1, berlin.day));

  let monday = berlinDateUtc;
  if (berlin.weekdayIndex === 6) {
    monday = addDaysUtc(berlinDateUtc, 2);
  } else if (berlin.weekdayIndex === 0) {
    monday = addDaysUtc(berlinDateUtc, 1);
  } else {
    monday = addDaysUtc(berlinDateUtc, -(berlin.weekdayIndex - 1));
  }

  const days = Array.from({ length: 5 }, (_, i) => formatYmd(addDaysUtc(monday, i)));

  return {
    weekStart: days[0],
    weekEnd: days[4],
    days
  };
};
