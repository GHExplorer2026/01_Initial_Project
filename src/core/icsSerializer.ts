import crypto from "node:crypto";
import { REGION_LABELS, type EconomicEvent } from "@/core/types";

const VTIMEZONE_BERLIN = [
  "BEGIN:VTIMEZONE",
  "TZID:Europe/Berlin",
  "X-LIC-LOCATION:Europe/Berlin",
  "BEGIN:DAYLIGHT",
  "TZOFFSETFROM:+0100",
  "TZOFFSETTO:+0200",
  "TZNAME:CEST",
  "DTSTART:19700329T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
  "END:DAYLIGHT",
  "BEGIN:STANDARD",
  "TZOFFSETFROM:+0200",
  "TZOFFSETTO:+0100",
  "TZNAME:CET",
  "DTSTART:19701025T030000",
  "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
  "END:STANDARD",
  "END:VTIMEZONE"
];

const parseOffsetMinutes = (timeZoneName: string): number => {
  const m = timeZoneName.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!m) {
    return 0;
  }
  const sign = m[1] === "+" ? 1 : -1;
  const hh = Number(m[2]);
  const mm = Number(m[3]);
  return sign * (hh * 60 + mm);
};

const getOffsetMinutesAtUtc = (date: Date, timeZone: string): number => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "longOffset",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).formatToParts(date);

  const tz = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT+00:00";
  return parseOffsetMinutes(tz);
};

const berlinLocalToUtc = (ymd: string, hh: number, mm: number): Date => {
  const [year, month, day] = ymd.split("-").map(Number);
  let utc = Date.UTC(year, month - 1, day, hh, mm, 0);

  for (let i = 0; i < 3; i += 1) {
    const offset = getOffsetMinutesAtUtc(new Date(utc), "Europe/Berlin");
    const next = Date.UTC(year, month - 1, day, hh, mm, 0) - offset * 60_000;
    if (next === utc) {
      break;
    }
    utc = next;
  }

  return new Date(utc);
};

const formatUtcStamp = (date: Date): string => {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mm = String(date.getUTCMinutes()).padStart(2, "0");
  const ss = String(date.getUTCSeconds()).padStart(2, "0");
  return `${y}${m}${d}T${hh}${mm}${ss}Z`;
};

const formatLocalDateTime = (ymd: string, hhmm: string): string => {
  const [year, month, day] = ymd.split("-");
  const [hh, mm] = hhmm.split(":");
  return `${year}${month}${day}T${hh}${mm}00`;
};

const formatLocalDate = (ymd: string): string => ymd.replace(/-/g, "");

const addMinutes = (ymd: string, hhmm: string, minutes: number): { ymd: string; hhmm: string } => {
  const [year, month, day] = ymd.split("-").map(Number);
  const [hh, mm] = hhmm.split(":").map(Number);
  const base = new Date(Date.UTC(year, month - 1, day, hh, mm, 0));
  base.setUTCMinutes(base.getUTCMinutes() + minutes);

  const y = base.getUTCFullYear();
  const m = String(base.getUTCMonth() + 1).padStart(2, "0");
  const d = String(base.getUTCDate()).padStart(2, "0");
  const h = String(base.getUTCHours()).padStart(2, "0");
  const min = String(base.getUTCMinutes()).padStart(2, "0");

  return { ymd: `${y}-${m}-${d}`, hhmm: `${h}:${min}` };
};

const foldLine = (line: string): string[] => {
  const chunks: string[] = [];
  let current = "";

  for (const char of line) {
    const candidate = `${current}${char}`;
    if (Buffer.byteLength(candidate, "utf8") > 75) {
      chunks.push(current);
      current = ` ${char}`;
    } else {
      current = candidate;
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
};

const uidForEvent = (event: EconomicEvent, weekStart: string, parserVersion: string): string => {
  const payload = `${weekStart}|${event.region}|${event.datetimeBerlinISO}|${event.titleNormalized}|${parserVersion}`;
  return `${crypto.createHash("sha256").update(payload).digest("hex").slice(0, 32)}@macro-events`;
};

const escapeText = (value: string): string =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");

const addOneDay = (ymd: string): string => {
  const [year, month, day] = ymd.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  date.setUTCDate(date.getUTCDate() + 1);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const metricValue = (value: EconomicEvent["actual"] | EconomicEvent["forecast"] | EconomicEvent["previous"]): string =>
  value?.value ?? "n/a";

const buildDescription = (event: EconomicEvent): string =>
  [
    `Importance: ${event.importance ?? "unknown"}`,
    `Actual: ${metricValue(event.actual)}`,
    `Forecast: ${metricValue(event.forecast)}`,
    `Previous: ${metricValue(event.previous)}`
  ].join("\n");

export const deterministicDtstampForWeek = (weekStart: string): string => {
  const utc = berlinLocalToUtc(weekStart, 0, 0);
  return formatUtcStamp(utc);
};

export const generateIcs = (events: EconomicEvent[], weekStart: string, parserVersion: string): string => {
  const dtstamp = deterministicDtstampForWeek(weekStart);

  const sorted = [...events].sort((a, b) => {
    const dt = a.datetimeBerlinISO.localeCompare(b.datetimeBerlinISO);
    if (dt !== 0) {
      return dt;
    }
    return a.region.localeCompare(b.region);
  });

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MacroEvents//WeeklyOutlook//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...VTIMEZONE_BERLIN
  ];

  for (const event of sorted) {
    const day = event.dateBerlinISO;
    const startField =
      event.timeKind === "all_day"
        ? `DTSTART;VALUE=DATE:${formatLocalDate(day)}`
        : `DTSTART;TZID=Europe/Berlin:${formatLocalDateTime(day, event.timeHHMM ?? "00:00")}`;
    const endField =
      event.timeKind === "all_day"
        ? `DTEND;VALUE=DATE:${formatLocalDate(addOneDay(day))}`
        : (() => {
            const endParts = addMinutes(day, event.timeHHMM ?? "00:00", 15);
            return `DTEND;TZID=Europe/Berlin:${formatLocalDateTime(endParts.ymd, endParts.hhmm)}`;
          })();

    const vevent = [
      "BEGIN:VEVENT",
      `UID:${uidForEvent(event, weekStart, parserVersion)}`,
      `DTSTAMP:${dtstamp}`,
      startField,
      endField,
      `SUMMARY:${escapeText(`${REGION_LABELS[event.region]} ${event.titleRaw}`)}`,
      `DESCRIPTION:${escapeText(buildDescription(event))}`,
      "CATEGORIES:Wirtschafts-Event",
      "END:VEVENT"
    ];

    lines.push(...vevent);
  }

  lines.push("END:VCALENDAR");

  const folded = lines.flatMap((line) => foldLine(line));
  return `${folded.join("\r\n")}\r\n`;
};
