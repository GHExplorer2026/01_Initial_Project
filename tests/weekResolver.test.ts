import { describe, expect, it } from "vitest";
import { resolveWeekInBerlin } from "@/core/weekResolver";

describe("resolveWeekInBerlin", () => {
  it("uses current week when date is Tuesday", () => {
    const result = resolveWeekInBerlin(new Date("2026-02-10T10:00:00Z"));
    expect(result.weekStart).toBe("2026-02-09");
    expect(result.weekEnd).toBe("2026-02-13");
    expect(result.days).toEqual(["2026-02-09", "2026-02-10", "2026-02-11", "2026-02-12", "2026-02-13"]);
  });

  it("uses next week when date is Saturday", () => {
    const result = resolveWeekInBerlin(new Date("2026-02-14T12:00:00Z"));
    expect(result.weekStart).toBe("2026-02-16");
    expect(result.weekEnd).toBe("2026-02-20");
  });
});
