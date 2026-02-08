import { CURRENCY_TO_REGION, type CurrencyCode, type EconomicEvent, type RawSourceEvent, type RegionCode } from "@/core/types";
import { classifyAF, isTopEvent, normalizeTitle } from "@/core/classifier";

const EXACT_TIME = /^([01]\d|2[0-3]):([0-5]\d)$/;

const inferRegion = (event: RawSourceEvent): RegionCode | null => {
  if (event.region) {
    return event.region;
  }
  if (event.currency) {
    return CURRENCY_TO_REGION[event.currency];
  }
  return null;
};

const inferCurrency = (region: RegionCode): CurrencyCode => {
  const entries = Object.entries(CURRENCY_TO_REGION) as [CurrencyCode, RegionCode][];
  const found = entries.find(([, r]) => r === region);
  if (!found) {
    return "USD";
  }
  return found[0];
};

const isExactTime = (time: string): boolean => EXACT_TIME.test(time.trim());

export const normalizeEvents = (rawEvents: RawSourceEvent[], parserVersion: string): EconomicEvent[] => {
  const normalized: EconomicEvent[] = [];

  for (const raw of rawEvents) {
    const region = inferRegion(raw);
    if (!region) {
      continue;
    }

    const time = raw.time.trim();
    const timeLower = time.toLowerCase();
    if (timeLower.includes("all day") || timeLower.includes("tentative") || !isExactTime(time)) {
      continue;
    }

    const titleNormalized = normalizeTitle(raw.title);
    const categoryAF = classifyAF(titleNormalized);
    if (!categoryAF) {
      continue;
    }

    const day = raw.date.trim();

    normalized.push({
      source: raw.source,
      region,
      currency: inferCurrency(region),
      titleRaw: raw.title,
      titleNormalized,
      categoryAF,
      datetimeBerlinISO: `${day}T${time}:00`,
      timeHHMM: time,
      hasExactTime: true,
      isTopEvent: isTopEvent(titleNormalized),
      provenance: {
        fetchedAtISO: raw.fetchedAtISO,
        parserVersion,
        sourceUrlHash: raw.sourceUrlHash
      }
    });
  }

  return normalized;
};
