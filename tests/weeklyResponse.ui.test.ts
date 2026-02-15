import { describe, expect, it } from "vitest";

import { normalizeWeeklyResponse } from "@/app/weeklyResponse";

describe("weekly response normalizer", () => {
  it("keeps valid rendered text and metadata", () => {
    const normalized = normalizeWeeklyResponse({
      renderedText: "strict",
      meta: {
        sourceMode: "fixtures",
        sourcesUsed: ["investing", "tradingview"]
      }
    });

    expect(normalized).toEqual({
      renderedText: "strict",
      sourceMode: "fixtures",
      sourcesUsed: ["investing", "tradingview"]
    });
  });

  it("falls back to deterministic defaults when metadata is missing", () => {
    const normalized = normalizeWeeklyResponse({
      renderedText: "strict"
    });

    expect(normalized).toEqual({
      renderedText: "strict",
      sourceMode: null,
      sourcesUsed: []
    });
  });

  it("rejects malformed values and trims source entries", () => {
    const normalized = normalizeWeeklyResponse({
      renderedText: 123,
      meta: {
        sourceMode: "unknown",
        sourcesUsed: [" investing ", "", 42, "tradingview", "investing"]
      }
    });

    expect(normalized).toEqual({
      renderedText: "",
      sourceMode: null,
      sourcesUsed: ["investing", "tradingview"]
    });
  });
});
