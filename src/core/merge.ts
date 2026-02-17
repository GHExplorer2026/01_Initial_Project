import type { EconomicEvent } from "@/core/types";

const SOURCE_PRIORITY: Record<string, number> = {
  investing: 3,
  tradingview: 2
};

const scoreSource = (source: string): number => {
  if (source.startsWith("tertiary:")) {
    return 1;
  }
  return SOURCE_PRIORITY[source] ?? 0;
};

const eventKey = (event: EconomicEvent): string => `${event.region}|${event.dateBerlinISO}|${event.titleNormalized}`;
const timeKindRank = (event: EconomicEvent): number => (event.timeKind === "exact" ? 1 : 0);

const mergeMetrics = (primary: EconomicEvent, candidates: EconomicEvent[]): EconomicEvent => {
  const merged: EconomicEvent = { ...primary };

  for (const candidate of candidates) {
    if (!merged.actual && candidate.actual) {
      merged.actual = candidate.actual;
    }
    if (!merged.forecast && candidate.forecast) {
      merged.forecast = candidate.forecast;
    }
    if (!merged.previous && candidate.previous) {
      merged.previous = candidate.previous;
    }
    if (merged.importance === "unknown" && candidate.importance !== "unknown") {
      merged.importance = candidate.importance;
    }
  }

  return merged;
};

export const mergeByPriority = (events: EconomicEvent[]): EconomicEvent[] => {
  const grouped = new Map<string, EconomicEvent[]>();

  for (const event of events) {
    const key = eventKey(event);
    const bucket = grouped.get(key) ?? [];
    bucket.push(event);
    grouped.set(key, bucket);
  }

  const merged: EconomicEvent[] = [];
  for (const [, group] of grouped.entries()) {
    const sorted = [...group].sort((a, b) => {
      const exactDelta = timeKindRank(b) - timeKindRank(a);
      if (exactDelta !== 0) {
        return exactDelta;
      }
      const sourceDelta = scoreSource(b.source) - scoreSource(a.source);
      if (sourceDelta !== 0) {
        return sourceDelta;
      }
      const parserDelta = b.provenance.parserVersion.localeCompare(a.provenance.parserVersion);
      if (parserDelta !== 0) {
        return parserDelta;
      }
      return b.titleNormalized.length - a.titleNormalized.length;
    });
    merged.push(mergeMetrics(sorted[0], sorted.slice(1)));
  }

  return merged;
};
