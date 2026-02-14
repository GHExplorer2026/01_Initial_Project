import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NOTE_HOLIDAY, NOTE_NO_VERIFIED } from "@/core/constants";
import { generateWeeklyOutlook } from "@/server/orchestrator";

const originalSourceMode = process.env.SOURCE_MODE;

afterEach(() => {
  process.env.SOURCE_MODE = originalSourceMode;
  vi.restoreAllMocks();
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
    const topLines = result.renderedText
      .split("\n")
      .filter((line) => line.includes("TOP-EVENT"));
    expect(topLines.length).toBeGreaterThan(0);
    expect(topLines.every((line) => line.endsWith(" - **TOP-EVENT**"))).toBe(true);
    expect(result.renderedText).not.toContain("http://");
    expect(result.renderedText).not.toContain("https://");

    expect(result.icsPayload).toContain("CATEGORIES:Wirtschafts-Event");
    expect(result.icsPayload).toContain("DTSTAMP:20260208T230000Z");
    expect(result.meta.sourceMode).toBe("fixtures");
    expect(result.meta.sourcesUsed).toEqual(["investing", "tradingview", "tertiary:bls"]);

    const second = await generateWeeklyOutlook({
      regions: ["USA", "EZ", "UK", "JP", "CH", "CA", "AU", "NZ"],
      now: new Date("2026-02-10T10:00:00Z")
    });

    expect(result.renderedText).toBe(second.renderedText);
    expect(result.icsPayload).toBe(second.icsPayload);
  });

  it("sets sourceMode live and reports used sources in live mode", async () => {
    process.env.SOURCE_MODE = "live";
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input);
      if (url.includes("investing.com")) {
        return new Response(JSON.stringify({ data: "" }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }

      if (url.includes("tradingview.com")) {
        return new Response(JSON.stringify({ status: "ok", result: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }

      throw new Error(`Unexpected live fetch URL: ${url}`);
    });

    const result = await generateWeeklyOutlook({
      regions: ["USA", "EZ"],
      now: new Date("2026-02-10T10:00:00Z")
    });

    expect(result.meta.sourceMode).toBe("live");
    expect(result.meta.sourcesUsed.length).toBeGreaterThan(0);
    expect(result.meta.sourcesUsed.some((source) => source === "investing" || source === "tradingview")).toBe(true);
  });

  it("uses no fixture fallback in live mode and emits no-verified fallback notes on source failures", async () => {
    process.env.SOURCE_MODE = "live";
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network down"));

    const result = await generateWeeklyOutlook({
      regions: ["USA", "EZ"],
      now: new Date("2026-02-10T10:00:00Z")
    });

    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(result.meta.sourceMode).toBe("live");
    expect(result.meta.sourcesUsed).toEqual(["tertiary"]);
    expect(result.events).toHaveLength(0);
    expect(result.days).toHaveLength(5);
    expect(result.days.every((day) => day.note === NOTE_NO_VERIFIED)).toBe(true);
    expect(result.renderedText).toContain(NOTE_NO_VERIFIED);
  });

  it("enforces investing priority on live time conflicts and flags tertiary usage", async () => {
    process.env.SOURCE_MODE = "live";
    const investingHtml = `
      <tr id="eventRowId_1" data-event-datetime="2026/02/09 13:30:00">
        <td class="left flagCur noWrap">flag USD</td>
        <td class="left event"><a>CPI (YoY)</a></td>
      </tr>
    `;
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input);
      if (url.includes("investing.com")) {
        return new Response(JSON.stringify({ data: investingHtml }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }

      if (url.includes("tradingview.com")) {
        return new Response(
          JSON.stringify({
            status: "ok",
            result: [{ title: "CPI (YoY)", currency: "USD", date: "2026-02-09T13:00:00.000Z" }]
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      throw new Error(`Unexpected live fetch URL: ${url}`);
    });

    const result = await generateWeeklyOutlook({
      regions: ["USA"],
      now: new Date("2026-02-10T10:00:00Z")
    });

    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(result.meta.sourceMode).toBe("live");
    expect(result.meta.sourcesUsed).toEqual(["investing", "tradingview", "tertiary"]);
    expect(result.events.some((event) => event.timeHHMM === "14:30")).toBe(true);
    expect(result.events.some((event) => event.timeHHMM === "14:00")).toBe(false);
    expect(result.renderedText).toContain("14:30 Uhr: USA CPI (YoY) - **TOP-EVENT**");
  });

  it("renders holiday fallback note on holiday workdays when no events remain after filtering", async () => {
    delete process.env.SOURCE_MODE;

    const result = await generateWeeklyOutlook({
      regions: ["USA"],
      now: new Date("2026-07-01T10:00:00Z")
    });
    const expectedText = readFileSync(
      path.join(process.cwd(), "tests/fixtures/golden/orchestrator_weekly_holiday_fallback.txt"),
      "utf8"
    );

    expect(result.meta.sourceMode).toBe("fixtures");
    expect(result.events).toHaveLength(0);
    expect(result.days).toHaveLength(5);
    expect(result.renderedText).toBe(expectedText);

    const friday = result.days.find((day) => day.dayHeader.includes("Freitag, 03. Juli"));
    expect(friday?.note).toBe(NOTE_HOLIDAY);
    expect(result.renderedText).toContain("### Freitag, 03. Juli");
    expect(result.renderedText).toContain(NOTE_HOLIDAY);
  });
});
