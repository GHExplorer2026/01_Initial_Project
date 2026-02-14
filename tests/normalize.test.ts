import { describe, expect, it } from "vitest";
import { normalizeEvents } from "@/core/normalize";
import type { RawSourceEvent } from "@/core/types";

const baseRaw = (overrides: Partial<RawSourceEvent>): RawSourceEvent => ({
  source: "investing",
  title: "CPI (YoY)",
  date: "2026-02-09",
  time: "14:30",
  currency: "USD",
  fetchedAtISO: "2026-02-08T08:00:00Z",
  ...overrides
});

describe("normalizeEvents", () => {
  it("keeps only exact-time events and excludes all-day, tentative and missing time", () => {
    const raw: RawSourceEvent[] = [
      baseRaw({ title: "CPI (YoY)", time: "14:30" }),
      baseRaw({ title: "GDP (QoQ)", time: "All Day" }),
      baseRaw({ title: "NFP", time: "Tentative" }),
      baseRaw({ title: "ISM Manufacturing PMI", time: "" })
    ];

    const normalized = normalizeEvents(raw, "v1.0.0");
    expect(normalized).toHaveLength(1);
    expect(normalized[0].timeHHMM).toBe("14:30");
    expect(normalized[0].hasExactTime).toBe(true);
  });

  it("maps region from currency when region is missing", () => {
    const normalized = normalizeEvents([baseRaw({ region: undefined, currency: "GBP", title: "GDP (QoQ)" })], "v1.0.0");
    expect(normalized).toHaveLength(1);
    expect(normalized[0].region).toBe("UK");
    expect(normalized[0].currency).toBe("GBP");
  });

  it("excludes uncertain multi-category titles and keeps deterministic provenance", () => {
    const raw: RawSourceEvent[] = [
      baseRaw({ title: "CPI and GDP release", time: "14:30" }),
      baseRaw({ title: "NFP", time: "14:30", sourceUrlHash: "abc123" })
    ];

    const normalized = normalizeEvents(raw, "v1.0.0");
    expect(normalized).toHaveLength(1);
    expect(normalized[0].titleRaw).toBe("NFP");
    expect(normalized[0].categoryAF).toBe("C");
    expect(normalized[0].isTopEvent).toBe(true);
    expect(normalized[0].provenance.parserVersion).toBe("v1.0.0");
    expect(normalized[0].provenance.sourceUrlHash).toBe("abc123");
  });
});
