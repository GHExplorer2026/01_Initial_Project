import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/weekly.ics/route";
import type { WeeklyOutput } from "@/core/types";
import { generateWeeklyOutlook } from "@/server/orchestrator";

vi.mock("@/server/orchestrator", () => ({
  generateWeeklyOutlook: vi.fn()
}));

const mockedGenerateWeeklyOutlook = vi.mocked(generateWeeklyOutlook);

const buildWeeklyOutput = (): WeeklyOutput => ({
  renderedText: "STRICT",
  events: [],
  days: [],
  meta: {
    parserVersion: "v1.0.0",
    generatedAtISO: "2026-02-08T00:00:00.000Z",
    weekStartBerlinISO: "2026-02-09T00:00:00+01:00",
    weekEndBerlinISO: "2026-02-13T23:59:59+01:00",
    sourceMode: "fixtures",
    sourcesUsed: ["investing", "tradingview"]
  },
  icsPayload: "BEGIN:VCALENDAR\r\nEND:VCALENDAR\r\n"
});

describe("GET /api/weekly.ics", () => {
  beforeEach(() => {
    mockedGenerateWeeklyOutlook.mockReset();
  });

  it("returns attachment response and calendar payload", async () => {
    mockedGenerateWeeklyOutlook.mockResolvedValue(buildWeeklyOutput());

    const response = await GET(new Request("http://localhost/api/weekly.ics?regions=USA,EZ"));
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/calendar; charset=utf-8");
    expect(response.headers.get("Content-Disposition")).toBe('attachment; filename="Wochenausblick_2026-02-09.ics"');
    expect(body).toBe("BEGIN:VCALENDAR\r\nEND:VCALENDAR\r\n");
    expect(mockedGenerateWeeklyOutlook).toHaveBeenCalledWith({ regions: ["USA", "EZ"] });
  });

  it("returns 400 on regions/countries conflict", async () => {
    const response = await GET(new Request("http://localhost/api/weekly.ics?regions=USA&countries=EUR"));
    const body = await response.text();

    expect(response.status).toBe(400);
    expect(body).toBe("regions and countries parameters conflict");
    expect(mockedGenerateWeeklyOutlook).not.toHaveBeenCalled();
  });

  it("returns 500 when orchestration fails", async () => {
    mockedGenerateWeeklyOutlook.mockRejectedValue(new Error("boom"));

    const response = await GET(new Request("http://localhost/api/weekly.ics?regions=USA"));
    const body = await response.text();

    expect(response.status).toBe(500);
    expect(body).toBe("failed to generate ics");
  });
});
