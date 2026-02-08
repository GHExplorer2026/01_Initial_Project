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

const eventKey = (event: EconomicEvent): string => `${event.region}|${event.datetimeBerlinISO.slice(0, 10)}|${event.titleNormalized}`;

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
    merged.push(sorted[0]);
  }

  return merged;
};
