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
    const eventLines = result.renderedText
      .split("\n")
      .filter((line) => /^\d{2}:\d{2} Uhr: /.test(line));
    expect(eventLines.length).toBeGreaterThan(0);
    expect(eventLines.every((line) => /^\d{2}:\d{2} Uhr: .+/.test(line))).toBe(true);
    expect(eventLines.every((line) => !line.endsWith(" "))).toBe(true);

    expect(result.icsPayload).toContain("CATEGORIES:Wirtschafts-Event");
    expect(result.icsPayload).toContain("DTSTAMP:20260208T230000Z");
    expect(result.meta.sourceMode).toBe("fixtures");
    expect(result.meta.sourcesUsed).toEqual(["investing", "tradingview", "tertiary:bls"]);
    expect(result.meta.weekStartBerlinISO).toBe("2026-02-09T00:00:00+01:00");
    expect(result.meta.weekEndBerlinISO).toBe("2026-02-13T23:59:59+01:00");

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
    expect(result.events).toHaveLength(0);
    expect(result.days).toHaveLength(5);
    expect(result.days.every((day) => day.note === NOTE_NO_VERIFIED)).toBe(true);
    expect(result.renderedText).toContain(NOTE_NO_VERIFIED);
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
    expect(result.meta.sourcesUsed).toEqual(["investing", "tradingview", "tertiary:approved"]);
    expect(result.events).toHaveLength(0);
    expect(result.days).toHaveLength(5);
    expect(result.days.every((day) => day.note === NOTE_NO_VERIFIED)).toBe(true);
    expect(result.renderedText).toContain(NOTE_NO_VERIFIED);
    const lines = result.renderedText.split("\n");
    const dayHeaders = lines.filter((line) => line.startsWith("### "));
    const eventLines = lines.filter((line) => /^\d{2}:\d{2} Uhr: /.test(line));
    const noteLines = lines.filter((line) => line === NOTE_NO_VERIFIED);
    expect(dayHeaders).toHaveLength(5);
    expect(eventLines).toHaveLength(0);
    expect(noteLines).toHaveLength(5);
    expect(dayHeaders[0]).toMatch(/^### Montag,/);
    expect(dayHeaders[4]).toMatch(/^### Freitag,/);
  });

  it("keeps processing when one live source fails but the other returns valid events", async () => {
    process.env.SOURCE_MODE = "live";
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input);
      if (url.includes("investing.com")) {
        return new Response("{}", { status: 503 });
      }

      if (url.includes("tradingview.com")) {
        return new Response(
          JSON.stringify({
            status: "ok",
            result: [{ title: "GDP (QoQ)", currency: "EUR", date: "2026-02-10T10:00:00.000Z" }]
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      throw new Error(`Unexpected live fetch URL: ${url}`);
    });

    const result = await generateWeeklyOutlook({
      regions: ["EZ"],
      now: new Date("2026-02-10T10:00:00Z")
    });

    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(result.meta.sourceMode).toBe("live");
    expect(result.meta.sourcesUsed).toEqual(["investing", "tradingview"]);
    expect(result.meta.sourcesUsed).not.toContain("tertiary:approved");
    expect(result.events).toHaveLength(1);
    expect(result.events[0]).toMatchObject({ source: "tradingview", region: "EZ", timeHHMM: "11:00" });
    expect(result.renderedText).toContain("11:00 Uhr: Euro Zone GDP (QoQ) - **TOP-EVENT**");
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
    expect(result.meta.sourcesUsed).toEqual(["investing", "tradingview", "tertiary:approved"]);
    expect(result.events.some((event) => event.timeHHMM === "14:30")).toBe(true);
    expect(result.events.some((event) => event.timeHHMM === "14:00")).toBe(false);
    expect(result.renderedText).toContain("14:30 Uhr: USA CPI (YoY) - **TOP-EVENT**");
  });

  it("does not call tertiary path in live mode when no trigger condition is met", async () => {
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
            result: [{ title: "GDP (QoQ)", currency: "EUR", date: "2026-02-10T10:00:00.000Z" }]
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      throw new Error(`Unexpected live fetch URL: ${url}`);
    });

    const result = await generateWeeklyOutlook({
      regions: ["USA", "EZ"],
      now: new Date("2026-02-10T10:00:00Z")
    });

    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(result.meta.sourceMode).toBe("live");
    expect(result.meta.sourcesUsed).toEqual(["investing", "tradingview"]);
    expect(result.meta.sourcesUsed).not.toContain("tertiary:approved");
    expect(result.events.some((event) => event.region === "USA" && event.timeHHMM === "14:30")).toBe(true);
    expect(result.events.some((event) => event.region === "EZ" && event.timeHHMM === "11:00")).toBe(true);
  });

  it("enforces selected region scope for strict output and ics payload", async () => {
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
            result: [{ title: "Housing Starts", currency: "CAD", date: "2026-02-09T13:15:00.000Z" }]
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      throw new Error(`Unexpected live fetch URL: ${url}`);
    });

    const result = await generateWeeklyOutlook({
      regions: ["CA"],
      now: new Date("2026-02-10T10:00:00Z")
    });

    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(result.events.length).toBeGreaterThan(0);
    expect(result.events.every((event) => event.region === "CA")).toBe(true);
    expect(result.renderedText).toContain("Canada");
    expect(result.renderedText).not.toContain("USA CPI");
    expect(result.icsPayload).toContain("SUMMARY:Canada ");
    expect(result.icsPayload).not.toContain("SUMMARY:USA ");
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
    expect(result.meta.weekStartBerlinISO).toBe("2026-06-29T00:00:00+02:00");
    expect(result.meta.weekEndBerlinISO).toBe("2026-07-03T23:59:59+02:00");

    const friday = result.days.find((day) => day.dayHeader.includes("Freitag, 03. Juli"));
    expect(friday?.note).toBe(NOTE_HOLIDAY);
    expect(result.renderedText).toContain("### Freitag, 03. Juli");
    expect(result.renderedText).toContain(NOTE_HOLIDAY);
  });

  it("uses upcoming Monday-Friday window when now is weekend in Berlin", async () => {
    delete process.env.SOURCE_MODE;

    const result = await generateWeeklyOutlook({
      regions: ["USA", "EZ"],
      now: new Date("2026-02-14T10:00:00Z")
    });

    expect(result.meta.weekStartBerlinISO).toBe("2026-02-16T00:00:00+01:00");
    expect(result.meta.weekEndBerlinISO).toBe("2026-02-20T23:59:59+01:00");
    expect(result.days).toHaveLength(5);
    expect(result.days[0].dayHeader).toBe("### Montag, 16. Februar");
    expect(result.days[4].dayHeader).toBe("### Freitag, 20. Februar");
    expect(result.renderedText.startsWith("📊 WOCHENAUSBLICK 16.02.2026 – 20.02.2026 Februar 2026")).toBe(true);
  });
});
