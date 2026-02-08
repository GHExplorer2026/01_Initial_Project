import type { RegionCode } from "@/core/types";

export const NOTE_WEEKEND_OR_HOLIDAY = "Hinweis: Keine Handelstermine – Wochenende oder Feiertag.";
export const NOTE_HOLIDAY = "Hinweis: Keine Handelstermine – Feiertag.";
export const NOTE_NO_VERIFIED = "Hinweis: Keine verifizierten Events gefunden.";

export const TOP_EVENT_SUFFIX = " - **TOP-EVENT**";

export const PARSER_VERSION = "v1.0.0";

export const HOLIDAYS_BY_DATE: Record<string, RegionCode[]> = {
  "2026-01-01": ["USA", "EZ", "UK", "JP", "CH", "CA", "AU", "NZ"],
  "2026-12-25": ["USA", "EZ", "UK", "JP", "CH", "CA", "AU", "NZ"],
  "2026-12-26": ["EZ", "UK", "CH", "CA", "AU", "NZ"],
  "2026-07-03": ["USA"],
  "2026-11-26": ["USA"]
};
