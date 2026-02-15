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

  it("prioritizes regions over deprecated countries when both resolve equally", async () => {
    mockedGenerateWeeklyOutlook.mockResolvedValue(buildWeeklyOutput());

    const response = await GET(new Request("http://localhost/api/weekly.ics?regions=USA,EZ&countries=USD,EUR"));

    expect(response.status).toBe(200);
    expect(mockedGenerateWeeklyOutlook).toHaveBeenCalledWith({ regions: ["USA", "EZ"] });
  });

  it("does not conflict when countries has invalid extras and regions are valid", async () => {
    mockedGenerateWeeklyOutlook.mockResolvedValue(buildWeeklyOutput());

    const response = await GET(new Request("http://localhost/api/weekly.ics?regions=USA,EZ&countries=USD,EUR,XXX"));

    expect(response.status).toBe(200);
    expect(mockedGenerateWeeklyOutlook).toHaveBeenCalledWith({ regions: ["USA", "EZ"] });
  });

  it("accepts normalized equivalent regions/countries sets without conflict", async () => {
    mockedGenerateWeeklyOutlook.mockResolvedValue(buildWeeklyOutput());

    const response = await GET(new Request("http://localhost/api/weekly.ics?regions=usa, ez,USA&countries=eur,usd"));

    expect(response.status).toBe(200);
    expect(mockedGenerateWeeklyOutlook).toHaveBeenCalledWith({ regions: ["USA", "EZ"] });
  });

  it("accepts deprecated countries alias when regions is absent", async () => {
    mockedGenerateWeeklyOutlook.mockResolvedValue(buildWeeklyOutput());

    const response = await GET(new Request("http://localhost/api/weekly.ics?countries=USD,EUR"));

    expect(response.status).toBe(200);
    expect(mockedGenerateWeeklyOutlook).toHaveBeenCalledWith({ regions: ["USA", "EZ"] });
  });

  it("normalizes deprecated countries alias with lowercase and whitespace", async () => {
    mockedGenerateWeeklyOutlook.mockResolvedValue(buildWeeklyOutput());

    const response = await GET(new Request("http://localhost/api/weekly.ics?countries= usd, eur "));

    expect(response.status).toBe(200);
    expect(mockedGenerateWeeklyOutlook).toHaveBeenCalledWith({ regions: ["USA", "EZ"] });
  });

  it("accepts deprecated countries alias when regions parameter is empty", async () => {
    mockedGenerateWeeklyOutlook.mockResolvedValue(buildWeeklyOutput());

    const response = await GET(new Request("http://localhost/api/weekly.ics?regions=&countries=USD,EUR"));

    expect(response.status).toBe(200);
    expect(mockedGenerateWeeklyOutlook).toHaveBeenCalledWith({ regions: ["USA", "EZ"] });
  });

  it("falls back to countries alias when regions contains only invalid values", async () => {
    mockedGenerateWeeklyOutlook.mockResolvedValue(buildWeeklyOutput());

    const response = await GET(new Request("http://localhost/api/weekly.ics?regions=foo&countries=USD,EUR"));

    expect(response.status).toBe(200);
    expect(mockedGenerateWeeklyOutlook).toHaveBeenCalledWith({ regions: ["USA", "EZ"] });
  });

  it("falls back to full region scope when regions and countries are both invalid", async () => {
    mockedGenerateWeeklyOutlook.mockResolvedValue(buildWeeklyOutput());

    const response = await GET(new Request("http://localhost/api/weekly.ics?regions=foo&countries=aaa"));

    expect(response.status).toBe(200);
    expect(mockedGenerateWeeklyOutlook).toHaveBeenCalledWith({
      regions: ["USA", "EZ", "UK", "JP", "CH", "CA", "AU", "NZ"]
    });
  });

  it("returns 400 on regions/countries conflict", async () => {
    const response = await GET(new Request("http://localhost/api/weekly.ics?regions=USA&countries=EUR"));
    const body = await response.text();

    expect(response.status).toBe(400);
    expect(body).toBe("regions and countries parameters conflict");
    expect(mockedGenerateWeeklyOutlook).not.toHaveBeenCalled();
  });

  it("returns 400 when normalized regions/countries sets still conflict", async () => {
    const response = await GET(new Request("http://localhost/api/weekly.ics?regions=usa,ez&countries=usd"));
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

  it("derives attachment filename from meta.weekStartBerlinISO", async () => {
    const output = buildWeeklyOutput();
    output.meta.weekStartBerlinISO = "2026-03-16T00:00:00+01:00";
    mockedGenerateWeeklyOutlook.mockResolvedValue(output);

    const response = await GET(new Request("http://localhost/api/weekly.ics?regions=USA"));

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Disposition")).toBe('attachment; filename="Wochenausblick_2026-03-16.ics"');
  });

  it("uses full region scope when no query parameter is provided", async () => {
    mockedGenerateWeeklyOutlook.mockResolvedValue(buildWeeklyOutput());

    const response = await GET(new Request("http://localhost/api/weekly.ics"));

    expect(response.status).toBe(200);
    expect(mockedGenerateWeeklyOutlook).toHaveBeenCalledWith({
      regions: ["USA", "EZ", "UK", "JP", "CH", "CA", "AU", "NZ"]
    });
  });

  it("passes ICS bytes through unchanged", async () => {
    const output = buildWeeklyOutput();
    output.icsPayload = "BEGIN:VCALENDAR\r\nX-LONG:1234567890\r\n 1234567890\r\nEND:VCALENDAR\r\n";
    mockedGenerateWeeklyOutlook.mockResolvedValue(output);

    const response = await GET(new Request("http://localhost/api/weekly.ics?regions=USA"));
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toBe("BEGIN:VCALENDAR\r\nX-LONG:1234567890\r\n 1234567890\r\nEND:VCALENDAR\r\n");
    expect(body).toContain("\r\n");
  });
});
