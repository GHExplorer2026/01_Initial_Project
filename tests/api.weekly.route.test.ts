import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/weekly/route";
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
  icsPayload: "ICS"
});

describe("GET /api/weekly", () => {
  beforeEach(() => {
    mockedGenerateWeeklyOutlook.mockReset();
  });

  it("uses regions as primary query parameter", async () => {
    mockedGenerateWeeklyOutlook.mockResolvedValue(buildWeeklyOutput());

    const response = await GET(new Request("http://localhost/api/weekly?regions=USA,EZ&countries=USD,EUR"));
    const payload = (await response.json()) as WeeklyOutput;

    expect(response.status).toBe(200);
    expect(mockedGenerateWeeklyOutlook).toHaveBeenCalledWith({ regions: ["USA", "EZ"] });
    expect(payload.meta.sourceMode).toBe("fixtures");
    expect(payload.meta.sourcesUsed).toEqual(["investing", "tradingview"]);
    expect((payload as unknown as Record<string, unknown>).icsPayload).toBeUndefined();
  });

  it("does not conflict when countries has invalid extras and regions are valid", async () => {
    mockedGenerateWeeklyOutlook.mockResolvedValue(buildWeeklyOutput());

    const response = await GET(new Request("http://localhost/api/weekly?regions=USA,EZ&countries=USD,EUR,XXX"));

    expect(response.status).toBe(200);
    expect(mockedGenerateWeeklyOutlook).toHaveBeenCalledWith({ regions: ["USA", "EZ"] });
  });

  it("accepts normalized equivalent regions/countries sets without conflict", async () => {
    mockedGenerateWeeklyOutlook.mockResolvedValue(buildWeeklyOutput());

    const response = await GET(new Request("http://localhost/api/weekly?regions=usa, ez,USA&countries=eur,usd"));

    expect(response.status).toBe(200);
    expect(mockedGenerateWeeklyOutlook).toHaveBeenCalledWith({ regions: ["USA", "EZ"] });
  });

  it("accepts deprecated countries alias when regions is absent", async () => {
    mockedGenerateWeeklyOutlook.mockResolvedValue(buildWeeklyOutput());

    const response = await GET(new Request("http://localhost/api/weekly?countries=USD,EUR"));

    expect(response.status).toBe(200);
    expect(mockedGenerateWeeklyOutlook).toHaveBeenCalledWith({ regions: ["USA", "EZ"] });
  });

  it("accepts deprecated countries alias when regions parameter is empty", async () => {
    mockedGenerateWeeklyOutlook.mockResolvedValue(buildWeeklyOutput());

    const response = await GET(new Request("http://localhost/api/weekly?regions=&countries=USD,EUR"));

    expect(response.status).toBe(200);
    expect(mockedGenerateWeeklyOutlook).toHaveBeenCalledWith({ regions: ["USA", "EZ"] });
  });

  it("falls back to countries alias when regions contains only invalid values", async () => {
    mockedGenerateWeeklyOutlook.mockResolvedValue(buildWeeklyOutput());

    const response = await GET(new Request("http://localhost/api/weekly?regions=foo&countries=USD,EUR"));

    expect(response.status).toBe(200);
    expect(mockedGenerateWeeklyOutlook).toHaveBeenCalledWith({ regions: ["USA", "EZ"] });
  });

  it("falls back to full region scope when regions and countries are both invalid", async () => {
    mockedGenerateWeeklyOutlook.mockResolvedValue(buildWeeklyOutput());

    const response = await GET(new Request("http://localhost/api/weekly?regions=foo&countries=aaa"));

    expect(response.status).toBe(200);
    expect(mockedGenerateWeeklyOutlook).toHaveBeenCalledWith({
      regions: ["USA", "EZ", "UK", "JP", "CH", "CA", "AU", "NZ"]
    });
  });

  it("returns 400 on regions/countries conflict", async () => {
    const response = await GET(new Request("http://localhost/api/weekly?regions=USA&countries=EUR"));
    const payload = (await response.json()) as { error: string };

    expect(response.status).toBe(400);
    expect(payload.error).toBe("regions and countries parameters conflict");
    expect(mockedGenerateWeeklyOutlook).not.toHaveBeenCalled();
  });

  it("returns 400 when normalized regions/countries sets still conflict", async () => {
    const response = await GET(new Request("http://localhost/api/weekly?regions=usa,ez&countries=usd"));
    const payload = (await response.json()) as { error: string };

    expect(response.status).toBe(400);
    expect(payload.error).toBe("regions and countries parameters conflict");
    expect(mockedGenerateWeeklyOutlook).not.toHaveBeenCalled();
  });

  it("returns 500 when orchestration fails", async () => {
    mockedGenerateWeeklyOutlook.mockRejectedValue(new Error("boom"));

    const response = await GET(new Request("http://localhost/api/weekly?regions=USA"));
    const payload = (await response.json()) as { error: string };

    expect(response.status).toBe(500);
    expect(payload.error).toBe("failed to generate weekly outlook");
  });

  it("uses full region scope when no query parameter is provided", async () => {
    mockedGenerateWeeklyOutlook.mockResolvedValue(buildWeeklyOutput());

    const response = await GET(new Request("http://localhost/api/weekly"));

    expect(response.status).toBe(200);
    expect(mockedGenerateWeeklyOutlook).toHaveBeenCalledWith({
      regions: ["USA", "EZ", "UK", "JP", "CH", "CA", "AU", "NZ"]
    });
  });

  it("passes through live mode meta fields without changing strict payload contract", async () => {
    const output = buildWeeklyOutput();
    output.meta.sourceMode = "live";
    output.meta.sourcesUsed = ["investing", "tradingview", "tertiary:bls"];
    mockedGenerateWeeklyOutlook.mockResolvedValue(output);

    const response = await GET(new Request("http://localhost/api/weekly?regions=USA,EZ"));
    const payload = (await response.json()) as WeeklyOutput;

    expect(response.status).toBe(200);
    expect(payload.meta.sourceMode).toBe("live");
    expect(payload.meta.sourcesUsed).toEqual(["investing", "tradingview", "tertiary:bls"]);
    expect(payload.renderedText).toBe("STRICT");
  });
});
