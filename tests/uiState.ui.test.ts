import { describe, expect, it } from "vitest";

import { deriveUiActionState, toUiErrorMessage } from "@/app/uiState";

describe("ui state helpers", () => {
  it("enables generate/download when regions are selected and not loading", () => {
    const state = deriveUiActionState(2, false);
    expect(state).toEqual({
      canGenerate: true,
      canDownloadIcs: true,
      generateLabel: "Wochenausblick generieren"
    });
  });

  it("disables generate while loading but keeps download enabled when selected", () => {
    const state = deriveUiActionState(1, true);
    expect(state).toEqual({
      canGenerate: false,
      canDownloadIcs: true,
      generateLabel: "Generiere..."
    });
  });

  it("disables both actions when nothing is selected", () => {
    const idle = deriveUiActionState(0, false);
    const loading = deriveUiActionState(0, true);
    expect(idle.canGenerate).toBe(false);
    expect(idle.canDownloadIcs).toBe(false);
    expect(loading.canGenerate).toBe(false);
    expect(loading.canDownloadIcs).toBe(false);
  });

  it("normalizes ui error messages deterministically", () => {
    expect(toUiErrorMessage(new Error("API 500"))).toBe("API 500");
    expect(toUiErrorMessage(new Error("Failed to fetch"))).toBe("Request failed");
    expect(toUiErrorMessage(new Error("  timeout  "))).toBe("Request failed");
    expect(toUiErrorMessage(new Error("   "))).toBe("Unknown error");
    expect(toUiErrorMessage("boom")).toBe("Unknown error");
    expect(toUiErrorMessage(null)).toBe("Unknown error");
  });
});
