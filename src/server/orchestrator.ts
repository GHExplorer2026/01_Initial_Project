import { PARSER_VERSION } from "@/core/constants";
import { dedupeEvents, groupForRendering } from "@/core/dedupeGroup";
import { applyHolidayFilter } from "@/core/holidayEngine";
import { generateIcs } from "@/core/icsSerializer";
import { mergeByPriority } from "@/core/merge";
import { normalizeEvents } from "@/core/normalize";
import { renderStrictWeeklyText } from "@/core/rendererStrictDe";
import type { EconomicEvent, RawSourceEvent, RegionCode, WeeklyOutput } from "@/core/types";
import { resolveWeekInBerlin } from "@/core/weekResolver";
import { resolveSourceMode } from "@/server/sourceMode";
import { fetchInvestingFixtureEvents, fetchInvestingLiveEvents } from "@/server/sources/investing";
import { fetchTradingViewFixtureEvents, fetchTradingViewLiveEvents } from "@/server/sources/tradingview";
import { fetchApprovedTertiaryFixtureEvents, fetchApprovedTertiaryLiveEvents } from "@/server/sources/tertiary/approved";

const conflictKey = (event: EconomicEvent): string => `${event.region}|${event.datetimeBerlinISO.slice(0, 10)}|${event.titleNormalized}`;

const detectTimeConflict = (primary: EconomicEvent[], secondary: EconomicEvent[]): boolean => {
  const p = new Map<string, string>();
  for (const event of primary) {
    p.set(conflictKey(event), event.timeHHMM);
  }

  for (const event of secondary) {
    const key = conflictKey(event);
    const primaryTime = p.get(key);
    if (primaryTime && primaryTime !== event.timeHHMM) {
      return true;
    }
  }

  return false;
};

const parseableExactTime = (event: RawSourceEvent): boolean => /^([01]\d|2[0-3]):([0-5]\d)$/.test(event.time.trim());

const detectMissingTimeSignals = (events: RawSourceEvent[]): boolean => events.some((event) => !parseableExactTime(event));

const berlinOffsetForDay = (ymd: string): string => {
  const probe = new Date(`${ymd}T12:00:00Z`);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Berlin",
    timeZoneName: "longOffset"
  }).formatToParts(probe);
  const tzName = parts.find((part) => part.type === "timeZoneName")?.value ?? "GMT+00:00";
  const match = tzName.match(/GMT([+-]\d{2}:\d{2})/);
  return match?.[1] ?? "+00:00";
};

export type GenerateParams = {
  regions: RegionCode[];
  now?: Date;
};

export const generateWeeklyOutlook = async ({ regions, now }: GenerateParams): Promise<WeeklyOutput> => {
  const week = resolveWeekInBerlin(now ?? new Date());
  const sourceMode = resolveSourceMode();
  const fetchInvesting = sourceMode === "live" ? fetchInvestingLiveEvents : fetchInvestingFixtureEvents;
  const fetchTradingView = sourceMode === "live" ? fetchTradingViewLiveEvents : fetchTradingViewFixtureEvents;
  const fetchTertiary = sourceMode === "live" ? fetchApprovedTertiaryLiveEvents : fetchApprovedTertiaryFixtureEvents;

  const [investing, tradingview] = await Promise.all([
    fetchInvesting(week.weekStart, week.weekEnd, regions),
    fetchTradingView(week.weekStart, week.weekEnd, regions)
  ]);

  const primaryNormalized = normalizeEvents(investing.events, PARSER_VERSION);
  const secondaryNormalized = normalizeEvents(tradingview.events, PARSER_VERSION);

  const needTertiary =
    detectTimeConflict(primaryNormalized, secondaryNormalized) ||
    detectMissingTimeSignals(investing.events) ||
    detectMissingTimeSignals(tradingview.events) ||
    (!investing.ok && !tradingview.ok);

  const tertiary = needTertiary
    ? await fetchTertiary(week.weekStart, week.weekEnd, regions)
    : { ok: true, events: [] as RawSourceEvent[] };

  const tertiaryNormalized = normalizeEvents(tertiary.events, PARSER_VERSION);

  const merged = mergeByPriority([...primaryNormalized, ...secondaryNormalized, ...tertiaryNormalized]);
  const deduped = dedupeEvents(merged);
  const selectedRegions = new Set(regions);
  const scopeFiltered = deduped.filter((event) => selectedRegions.has(event.region));

  const { filteredEvents, dayStatus } = applyHolidayFilter(scopeFiltered, week.days, regions);
  const grouped = groupForRendering(filteredEvents);

  const dataReliable = investing.ok || tradingview.ok;

  const rendered = renderStrictWeeklyText(week, grouped, dayStatus, dataReliable);
  const icsPayload = generateIcs(filteredEvents, week.weekStart, PARSER_VERSION);

  const sourcesUsed: string[] = ["investing", "tradingview"];
  if (needTertiary) {
    const tertiarySources = Array.from(
      new Set(
        tertiary.events
          .map((event) => event.source)
          .filter((source): source is `tertiary:${string}` => source.startsWith("tertiary:"))
      )
    ).sort();
    if (tertiarySources.length === 0) {
      sourcesUsed.push("tertiary:approved");
    } else {
      sourcesUsed.push(...tertiarySources);
    }
  }

  return {
    renderedText: rendered.renderedText,
    events: filteredEvents,
    days: rendered.days,
    meta: {
      parserVersion: PARSER_VERSION,
      generatedAtISO: new Date().toISOString(),
      weekStartBerlinISO: `${week.weekStart}T00:00:00${berlinOffsetForDay(week.weekStart)}`,
      weekEndBerlinISO: `${week.weekEnd}T23:59:59${berlinOffsetForDay(week.weekEnd)}`,
      sourceMode,
      sourcesUsed
    },
    icsPayload
  };
};
