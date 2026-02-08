import fs from "node:fs/promises";
import path from "node:path";
import type { RegionCode, RawSourceEvent } from "@/core/types";
import type { SourceFetchResult } from "@/server/sources/types";

const shouldUseFixtures = (): boolean => process.env.USE_LOCAL_FIXTURES !== "false";

const fixturePath = (name: string): string => path.join(process.cwd(), "src", "server", "fixtures", name);

const inWeek = (date: string, weekStart: string, weekEnd: string): boolean => date >= weekStart && date <= weekEnd;

export const readFixtureEvents = async (
  fixtureFile: string,
  weekStart: string,
  weekEnd: string,
  allowedRegions: RegionCode[]
): Promise<SourceFetchResult> => {
  if (!shouldUseFixtures()) {
    return {
      ok: false,
      events: [],
      error: "Fixture mode disabled"
    };
  }

  try {
    const file = await fs.readFile(fixturePath(fixtureFile), "utf8");
    const parsed = JSON.parse(file) as RawSourceEvent[];
    const allow = new Set(allowedRegions);

    const events = parsed.filter((event) => {
      if (event.region && !allow.has(event.region)) {
        return false;
      }
      return inWeek(event.date, weekStart, weekEnd);
    });

    return {
      ok: true,
      events
    };
  } catch (error) {
    return {
      ok: false,
      events: [],
      error: error instanceof Error ? error.message : "unknown fixture error"
    };
  }
};
