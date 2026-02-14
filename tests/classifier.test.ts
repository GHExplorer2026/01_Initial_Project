import { describe, expect, it } from "vitest";
import { classifyAF, isTopEvent, normalizeTitle } from "@/core/classifier";

describe("classifier", () => {
  it("normalizes accents and whitespace in titles", () => {
    expect(normalizeTitle("  BIP  ProjektiÓN   ")).toBe("bip projektion");
  });

  it("classifies a clear single-category title into A-F", () => {
    expect(classifyAF(normalizeTitle("BoJ Rate Decision"))).toBe("A");
    expect(classifyAF(normalizeTitle("Core CPI (YoY)"))).toBe("B");
    expect(classifyAF(normalizeTitle("Nonfarm Payrolls (NFP)"))).toBe("C");
    expect(classifyAF(normalizeTitle("GDP (QoQ)"))).toBe("D");
    expect(classifyAF(normalizeTitle("Retail Sales (MoM)"))).toBe("E");
    expect(classifyAF(normalizeTitle("Building Permits"))).toBe("F");
  });

  it("returns null when title matches multiple categories (uncertain => exclude)", () => {
    expect(classifyAF(normalizeTitle("CPI and GDP release"))).toBeNull();
  });

  it("detects top-event titles by configured patterns", () => {
    expect(isTopEvent(normalizeTitle("ECB Statement"))).toBe(true);
    expect(isTopEvent(normalizeTitle("ISM Manufacturing PMI"))).toBe(true);
    expect(isTopEvent(normalizeTitle("Retail Sales"))).toBe(false);
  });
});
