import { describe, expect, it } from "vitest";
import { resolveSourceMode } from "@/server/sourceMode";

describe("resolveSourceMode", () => {
  it("defaults to fixtures", () => {
    expect(resolveSourceMode(undefined)).toBe("fixtures");
    expect(resolveSourceMode("")).toBe("fixtures");
    expect(resolveSourceMode("unknown")).toBe("fixtures");
  });

  it("accepts live", () => {
    expect(resolveSourceMode("live")).toBe("live");
    expect(resolveSourceMode("LIVE")).toBe("live");
  });
});
