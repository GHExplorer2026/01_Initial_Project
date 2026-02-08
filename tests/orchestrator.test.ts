import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { generateWeeklyOutlook } from "@/server/orchestrator";

const originalSourceMode = process.env.SOURCE_MODE;

afterEach(() => {
  process.env.SOURCE_MODE = originalSourceMode;
});

describe("generateWeeklyOutlook", () => {
  it("produces deterministic strict text and ics for fixture inputs", async () => {
    delete process.env.SOURCE_MODE;

    const result = await generateWeeklyOutlook({
      regions: ["USA", "EZ", "UK", "JP", "CH", "CA", "AU", "NZ"],
      now: new Date("2026-02-10T10:00:00Z")
    });
    const expectedText = readFileSync(path.join(process.cwd(), "tests/fixtures/golden/orchestrator_weekly.txt"), "utf8");

    expect(result.renderedText).toBe(expectedText);
    expect(result.renderedText).toContain(" - **TOP-EVENT**");
    expect(result.renderedText).not.toContain("http://");
    expect(result.renderedText).not.toContain("https://");

    expect(result.icsPayload).toContain("CATEGORIES:Wirtschafts-Event");
    expect(result.icsPayload).toContain("DTSTAMP:20260208T230000Z");
    expect(result.meta.sourceMode).toBe("fixtures");
    expect(result.meta.sourcesUsed).toContain("investing");
    expect(result.meta.sourcesUsed).toContain("tradingview");

    const second = await generateWeeklyOutlook({
      regions: ["USA", "EZ", "UK", "JP", "CH", "CA", "AU", "NZ"],
      now: new Date("2026-02-10T10:00:00Z")
    });

    expect(result.renderedText).toBe(second.renderedText);
    expect(result.icsPayload).toBe(second.icsPayload);
  });

  it("sets sourceMode live and reports used sources in live mode", async () => {
    process.env.SOURCE_MODE = "live";

    const result = await generateWeeklyOutlook({
      regions: ["USA", "EZ"],
      now: new Date("2026-02-10T10:00:00Z")
    });

    expect(result.meta.sourceMode).toBe("live");
    expect(result.meta.sourcesUsed.length).toBeGreaterThan(0);
    expect(result.meta.sourcesUsed.some((source) => source === "investing" || source === "tradingview")).toBe(true);
  });
});
