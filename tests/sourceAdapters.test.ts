import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchInvestingLiveEvents } from "@/server/sources/investing";
import { fetchApprovedTertiaryFixtureEvents, fetchApprovedTertiaryLiveEvents } from "@/server/sources/tertiary/approved";
import { fetchTradingViewLiveEvents } from "@/server/sources/tradingview";

const sourceFixture = (name: string): string =>
  readFileSync(path.join(process.cwd(), "tests", "fixtures", "sources", name), "utf8");

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("source adapters", () => {
  it("parses investing live response and filters unsupported currencies", async () => {
    const html = `
      <tr id="eventRowId_1" data-event-datetime="2026/02/09 13:30:00">
        <td class="left flagCur noWrap">something USD</td>
        <td class="left event"><a>CPI (YoY)</a></td>
      </tr>
      <tr id="eventRowId_2" data-event-datetime="2026/02/09 13:45:00">
        <td class="left flagCur noWrap">something XXX</td>
        <td class="left event"><a>Ignored Event</a></td>
      </tr>
      <tr id="eventRowId_3" data-event-datetime="not-a-date">
        <td class="left flagCur noWrap">something EUR</td>
        <td class="left event"><a>Ignored Invalid Date</a></td>
      </tr>
    `;
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ data: html }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      })
    );

    const result = await fetchInvestingLiveEvents("2026-02-09", "2026-02-13", ["USA", "EZ"]);

    expect(result.ok).toBe(true);
    expect(result.events).toHaveLength(1);
    expect(result.events[0].source).toBe("investing");
    expect(result.events[0].currency).toBe("USD");
    expect(result.events[0].title).toBe("CPI (YoY)");
    expect(result.events[0].date).toBe("2026-02-09");
    expect(result.events[0].time).toBe("14:30");

    const [url, options] = vi.mocked(globalThis.fetch).mock.calls[0];
    expect(String(url)).toContain("investing.com/economic-calendar/Service/getCalendarFilteredData");
    expect(options?.method).toBe("POST");
    expect(options?.headers).toMatchObject({
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    });
    const body = options?.body as URLSearchParams;
    expect(body.get("dateFrom")).toBe("2026-02-09");
    expect(body.get("dateTo")).toBe("2026-02-13");
    expect(body.get("timeFilter")).toBeNull();
    expect(body.getAll("country[]")).toEqual(["5", "72"]);
  });

  it("parses investing rows with flexible quoting, attribute order and non-anchor event cells", async () => {
    const html = sourceFixture("investing_drift_rows.html");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ data: html }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      })
    );

    const result = await fetchInvestingLiveEvents("2026-02-09", "2026-02-13", ["USA", "EZ"]);

    expect(result.ok).toBe(true);
    expect(result.events).toHaveLength(2);
    expect(result.events[0]).toMatchObject({
      source: "investing",
      currency: "USD",
      title: "GDP (QoQ)",
      date: "2026-02-10",
      time: "11:00"
    });
    expect(result.events[1]).toMatchObject({
      source: "investing",
      currency: "EUR",
      title: "ISM Manufacturing PMI",
      date: "2026-02-10",
      time: "12:30"
    });
  });

  it("parses investing all-day rows and metrics columns", async () => {
    const html = `
      <tr id="eventRowId_4" data-event-datetime="2026/02/10 00:00:00">
        <td class="left time">All Day</td>
        <td class="left flagCur noWrap">x USD</td>
        <td class="left event"><a>Bank Holiday</a></td>
        <td class="left sentiment"><i></i><i></i><i></i></td>
        <td class="left act">2.1%</td>
        <td class="left fore">2.0%</td>
        <td class="left prev">1.9%</td>
      </tr>
    `;
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ data: html }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      })
    );

    const result = await fetchInvestingLiveEvents("2026-02-09", "2026-02-13", ["USA"]);

    expect(result.ok).toBe(true);
    expect(result.events).toHaveLength(1);
    expect(result.events[0]).toMatchObject({
      source: "investing",
      currency: "USD",
      title: "Bank Holiday",
      time: "All Day",
      timeKind: "all_day",
      importance: "high",
      actual: "2.1%",
      forecast: "2.0%",
      previous: "1.9%"
    });
  });

  it("returns investing error result for non-ok responses and thrown errors", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(new Response("{}", { status: 503 }));
    const nonOk = await fetchInvestingLiveEvents("2026-02-09", "2026-02-13", ["USA"]);
    expect(nonOk.ok).toBe(false);
    expect(nonOk.error).toContain("503");

    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("dns"));
    const thrown = await fetchInvestingLiveEvents("2026-02-09", "2026-02-13", ["USA"]);
    expect(thrown.ok).toBe(false);
    expect(thrown.error).toBe("dns");
  });

  it("parses tradingview live response and enforces payload status", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          status: "ok",
          result: [
            { title: "GDP (QoQ)", currency: "EUR", date: "2026-02-10T10:00:00.000Z" },
            { title: "Ignored", currency: "XXX", date: "2026-02-10T10:00:00.000Z" },
            { title: "Ignored Missing Date", currency: "EUR" }
          ]
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    const ok = await fetchTradingViewLiveEvents("2026-02-09", "2026-02-13", ["EZ"]);
    expect(ok.ok).toBe(true);
    expect(ok.events).toHaveLength(1);
    expect(ok.events[0].source).toBe("tradingview");
    expect(ok.events[0].currency).toBe("EUR");
    expect(ok.events[0].date).toBe("2026-02-10");
    expect(ok.events[0].time).toBe("11:00");
    const [url] = vi.mocked(globalThis.fetch).mock.calls[0];
    expect(String(url)).toContain("economic-calendar.tradingview.com/events?");
    expect(String(url)).toContain("from=2026-02-09T00%3A00%3A00.000Z");
    expect(String(url)).toContain("to=2026-02-13T23%3A59%3A59.999Z");

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ status: "error" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      })
    );
    const badStatus = await fetchTradingViewLiveEvents("2026-02-09", "2026-02-13", ["EZ"]);
    expect(badStatus.ok).toBe(false);
    expect(badStatus.error).toBe("tradingview live response status is not ok");
  });

  it("normalizes tradingview currency/title and excludes invalid or empty values", async () => {
    const payload = sourceFixture("tradingview_drift_payload.json");
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(payload, { status: 200, headers: { "Content-Type": "application/json" } })
    );

    const result = await fetchTradingViewLiveEvents("2026-02-09", "2026-02-13", ["USA", "EZ"]);
    expect(result.ok).toBe(true);
    expect(result.events).toHaveLength(1);
    expect(result.events[0]).toMatchObject({
      source: "tradingview",
      currency: "USD",
      title: "Retail Sales",
      date: "2026-02-11",
      time: "14:30"
    });
  });

  it("returns tradingview errors for non-ok responses and thrown errors", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(new Response("{}", { status: 500 }));
    const nonOk = await fetchTradingViewLiveEvents("2026-02-09", "2026-02-13", ["USA"]);
    expect(nonOk.ok).toBe(false);
    expect(nonOk.error).toContain("500");

    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("timeout"));
    const thrown = await fetchTradingViewLiveEvents("2026-02-09", "2026-02-13", ["USA"]);
    expect(thrown.ok).toBe(false);
    expect(thrown.error).toBe("timeout");
  });

  it("maps abort errors to deterministic timeout messages", async () => {
    vi.stubEnv("SOURCE_FETCH_TIMEOUT_MS", "3210");
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new DOMException("The operation was aborted", "AbortError"));

    const result = await fetchInvestingLiveEvents("2026-02-09", "2026-02-13", ["USA"]);

    expect(result.ok).toBe(false);
    expect(result.error).toBe("source request timeout after 3210ms");
  });

  it("accepts tradingview epoch timestamps in seconds and milliseconds", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          status: "ok",
          result: [
            { title: "GDP (QoQ)", currency: "eur", date: 1770816600 },
            { title: "Retail Sales", currency: "USD", date: 1770816600000 }
          ]
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    const result = await fetchTradingViewLiveEvents("2026-02-09", "2026-02-13", ["USA", "EZ"]);

    expect(result.ok).toBe(true);
    expect(result.events).toHaveLength(2);
    expect(result.events[0]).toMatchObject({
      source: "tradingview",
      currency: "EUR",
      title: "GDP (QoQ)",
      date: "2026-02-11",
      time: "14:30"
    });
    expect(result.events[1]).toMatchObject({
      source: "tradingview",
      currency: "USD",
      title: "Retail Sales",
      date: "2026-02-11",
      time: "14:30"
    });
  });

  it("uses fixture and disabled-live behavior for tertiary adapters", async () => {
    const fixtureUsa = await fetchApprovedTertiaryFixtureEvents("2026-02-09", "2026-02-13", ["USA"]);
    expect(fixtureUsa.ok).toBe(true);
    expect(fixtureUsa.events).toHaveLength(1);
    expect(fixtureUsa.events[0].source).toBe("tertiary:bls");

    const fixtureEz = await fetchApprovedTertiaryFixtureEvents("2026-02-09", "2026-02-13", ["EZ"]);
    expect(fixtureEz.ok).toBe(true);
    expect(fixtureEz.events).toHaveLength(0);

    const live = await fetchApprovedTertiaryLiveEvents("2026-02-09", "2026-02-13", ["USA"]);
    expect(live.ok).toBe(false);
    expect(live.error).toBe("approved tertiary live adapters not configured");
  });
});
