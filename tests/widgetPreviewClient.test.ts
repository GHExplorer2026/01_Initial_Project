import { describe, expect, it } from "vitest";
import {
  DEFAULT_WIDGET_SETTINGS,
  buildWidgetFeedEndpoint,
  toTickerItems,
  type WidgetFeedEvent
} from "@/app/widgetPreviewClient";

describe("widgetPreviewClient", () => {
  it("builds widget-feed endpoint with regions primary and no deprecated countries alias", () => {
    const endpoint = buildWidgetFeedEndpoint({
      ...DEFAULT_WIDGET_SETTINGS,
      countries: ["USA", "EZ"],
      datePreset: "today",
      currencies: ["USD", "EUR"],
      importanceLevels: ["high", "medium"]
    });

    expect(endpoint.startsWith("/api/widget-feed?")).toBe(true);
    expect(endpoint).toContain("regions=USA%2CEZ");
    expect(endpoint).toContain("datePreset=today");
    expect(endpoint).toContain("currencies=USD%2CEUR");
    expect(endpoint).toContain("importance=high%2Cmedium");
    expect(endpoint.includes("countries=")).toBe(false);
  });

  it("only includes customFrom/customTo when datePreset=custom", () => {
    const customEndpoint = buildWidgetFeedEndpoint({
      ...DEFAULT_WIDGET_SETTINGS,
      datePreset: "custom",
      customFrom: "2026-02-10",
      customTo: "2026-02-12"
    });
    const todayEndpoint = buildWidgetFeedEndpoint({
      ...DEFAULT_WIDGET_SETTINGS,
      datePreset: "today",
      customFrom: "2026-02-10",
      customTo: "2026-02-12"
    });

    expect(customEndpoint).toContain("customFrom=2026-02-10");
    expect(customEndpoint).toContain("customTo=2026-02-12");
    expect(todayEndpoint).not.toContain("customFrom=");
    expect(todayEndpoint).not.toContain("customTo=");
  });

  it("renders ticker items with n/a fallback and top-event emphasis", () => {
    const events: WidgetFeedEvent[] = [
      {
        eventId: "e1",
        datetimeUTC: "2026-02-10T14:30:00.000Z",
        timeKind: "exact",
        region: "USA",
        countryLabel: "USA",
        currency: "USD",
        titleRaw: "CPI (YoY)",
        importance: "high",
        isTopEvent: true,
        source: "investing",
        provenance: { fetchedAtISO: "2026-02-10T08:00:00.000Z", parserVersion: "v1" }
      },
      {
        eventId: "e2",
        datetimeUTC: "2026-02-10T00:00:00.000Z",
        timeKind: "all_day",
        region: "EZ",
        countryLabel: "Euro Zone",
        currency: "EUR",
        titleRaw: "Bank Holiday",
        importance: "unknown",
        isTopEvent: false,
        actual: "",
        forecast: "",
        previous: "",
        source: "investing",
        provenance: { fetchedAtISO: "2026-02-10T08:00:00.000Z", parserVersion: "v1" }
      }
    ];

    const items = toTickerItems(events);

    expect(items).toHaveLength(2);
    expect(items[0].isTop).toBe(true);
    expect(items[0].text).toContain("USA CPI (YoY)");
    expect(items[1].text).toContain("All Day EZ Bank Holiday");
    expect(items[1].text).toContain("A:n/a F:n/a P:n/a");
  });
});
