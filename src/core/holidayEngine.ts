import { HOLIDAYS_BY_DATE } from "@/core/constants";
import type { DayStatus, EconomicEvent, RegionCode } from "@/core/types";

const dayFromIso = (datetimeBerlinISO: string): string => datetimeBerlinISO.slice(0, 10);

export const applyHolidayFilter = (
  events: EconomicEvent[],
  days: string[],
  selectedRegions: RegionCode[]
): { filteredEvents: EconomicEvent[]; dayStatus: Record<string, DayStatus> } => {
  const dayStatus: Record<string, DayStatus> = Object.fromEntries(
    days.map((day) => [
      day,
      {
        holidayTriggered: false,
        isWeekend: false,
        verificationFailed: false
      }
    ])
  );

  const selected = new Set(selectedRegions);
  const filteredEvents = events.filter((event) => {
    const day = dayFromIso(event.datetimeBerlinISO);
    const holidays = HOLIDAYS_BY_DATE[day] ?? [];
    const isHolidayForRegion = holidays.includes(event.region) && selected.has(event.region);
    if (isHolidayForRegion) {
      dayStatus[day].holidayTriggered = true;
      return false;
    }
    return true;
  });

  for (const day of days) {
    const dayDate = new Date(`${day}T00:00:00Z`);
    const weekday = dayDate.getUTCDay();
    if (weekday === 0 || weekday === 6) {
      dayStatus[day].isWeekend = true;
    }

    if (!dayStatus[day].holidayTriggered) {
      const holidayRegions = (HOLIDAYS_BY_DATE[day] ?? []).filter((region) => selected.has(region));
      dayStatus[day].holidayTriggered = holidayRegions.length > 0;
    }
  }

  return { filteredEvents, dayStatus };
};
