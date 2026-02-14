import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchInvestingLiveEvents } from "@/server/sources/investing";
import { fetchApprovedTertiaryFixtureEvents, fetchApprovedTertiaryLiveEvents } from "@/server/sources/tertiary/approved";
import { fetchTradingViewLiveEvents } from "@/server/sources/tradingview";

afterEach(() => {
  vi.restoreAllMocks();
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
    expect(body.get("timeFilter")).toBe("timeOnly");
    expect(body.getAll("country[]")).toEqual(["5", "72"]);
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
