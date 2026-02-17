import { REGION_ORDER, type EconomicEvent, type GroupedRenderEvent, type RegionCode } from "@/core/types";

const dedupeKey = (event: EconomicEvent): string => {
  const timePart = event.timeKind === "exact" ? event.timeHHMM ?? "" : "ALL_DAY";
  return `${event.region}|${event.dateBerlinISO}|${timePart}|${event.titleNormalized}`;
};

const dayFromIso = (datetimeBerlinISO: string): string => datetimeBerlinISO.slice(0, 10);

const regionOrderIndex = (region: RegionCode): number => REGION_ORDER.indexOf(region);

export const dedupeEvents = (events: EconomicEvent[]): EconomicEvent[] => {
  const seen = new Set<string>();
  const out: EconomicEvent[] = [];

  for (const event of events) {
    const key = dedupeKey(event);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    out.push(event);
  }

  return out;
};

export const groupForRendering = (events: EconomicEvent[]): GroupedRenderEvent[] => {
  const grouped = new Map<string, GroupedRenderEvent>();

  for (const event of events) {
    const key = `${event.region}|${event.dateBerlinISO}|${event.timeKind}|${event.timeHHMM ?? ""}`;
    const existing = grouped.get(key);
    if (!existing) {
      grouped.set(key, {
        region: event.region,
        day: dayFromIso(event.datetimeBerlinISO),
        timeKind: event.timeKind,
        timeHHMM: event.timeHHMM,
        title: event.titleRaw,
        isTopEvent: event.isTopEvent,
        datetimeBerlinISO: event.datetimeBerlinISO
      });
      continue;
    }

    const titles = new Set(existing.title.split(" / "));
    titles.add(event.titleRaw);
    existing.title = [...titles].sort((a, b) => a.localeCompare(b, "de-DE")).join(" / ");
    existing.isTopEvent = existing.isTopEvent || event.isTopEvent;
  }

  return [...grouped.values()].sort((a, b) => {
    const dayDelta = a.day.localeCompare(b.day);
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
    const dt = aTime.localeCompare(bTime);
    if (dt !== 0) {
      return dt;
    }
    return regionOrderIndex(a.region) - regionOrderIndex(b.region);
  });
};
