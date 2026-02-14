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

  it("uses next week when date is Sunday", () => {
    const result = resolveWeekInBerlin(new Date("2026-02-15T12:00:00Z"));
    expect(result.weekStart).toBe("2026-02-16");
    expect(result.weekEnd).toBe("2026-02-20");
  });

  it("handles DST start weekend in Europe/Berlin and still selects next Monday-Friday", () => {
    const result = resolveWeekInBerlin(new Date("2026-03-29T01:30:00Z"));
    expect(result.weekStart).toBe("2026-03-30");
    expect(result.weekEnd).toBe("2026-04-03");
    expect(result.days).toEqual(["2026-03-30", "2026-03-31", "2026-04-01", "2026-04-02", "2026-04-03"]);
  });

  it("handles DST end weekend in Europe/Berlin and still selects next Monday-Friday", () => {
    const result = resolveWeekInBerlin(new Date("2026-10-25T01:30:00Z"));
    expect(result.weekStart).toBe("2026-10-26");
    expect(result.weekEnd).toBe("2026-10-30");
    expect(result.days).toEqual(["2026-10-26", "2026-10-27", "2026-10-28", "2026-10-29", "2026-10-30"]);
  });
});
