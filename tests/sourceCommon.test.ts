import { describe, expect, it } from "vitest";
import { decodeHtml, readFixtureEvents, stripHtml, toBerlinDateTime } from "@/server/sources/common";

describe("source common utilities", () => {
  it("filters fixture events by week and allowed regions", async () => {
    const result = await readFixtureEvents("investing.json", "2026-02-09", "2026-02-10", ["USA"]);
    expect(result.ok).toBe(true);
    expect(result.events).toHaveLength(1);
    expect(result.events[0].region).toBe("USA");
    expect(result.events[0].date).toBe("2026-02-09");
  });

  it("decodes html entities and strips tags deterministically", () => {
    expect(decodeHtml("A&nbsp;&amp;&nbsp;B")).toBe("A & B");
    expect(stripHtml("<b>Retail&nbsp;Sales</b> &amp; <i>Income</i>")).toBe("Retail Sales & Income");
  });

  it("converts UTC timestamps to Europe/Berlin local date and time", () => {
    expect(toBerlinDateTime(new Date("2026-02-09T13:30:00Z"))).toEqual({
      date: "2026-02-09",
      time: "14:30"
    });

    expect(toBerlinDateTime(new Date("2026-07-06T12:00:00Z"))).toEqual({
      date: "2026-07-06",
      time: "14:00"
    });
  });

  it("returns deterministic error result when fixture file is missing", async () => {
    const result = await readFixtureEvents("does-not-exist.json", "2026-02-09", "2026-02-13", ["USA"]);
    expect(result.ok).toBe(false);
    expect(result.events).toEqual([]);
    expect(typeof result.error).toBe("string");
    expect(result.error?.length).toBeGreaterThan(0);
  });
});
