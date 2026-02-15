import { describe, expect, it } from "vitest";

import { buildIcsEndpoint, buildWeeklyEndpoint } from "@/app/uiRequests";

describe("ui request helpers", () => {
  it("builds weekly endpoint with deterministic primary regions ordering", () => {
    expect(buildWeeklyEndpoint(["UK", "USA", "EZ"])).toBe("/api/weekly?regions=USA%2CEZ%2CUK");
  });

  it("builds ics endpoint with deterministic primary regions ordering", () => {
    expect(buildIcsEndpoint(["NZ", "AU", "USA"])).toBe("/api/weekly.ics?regions=USA%2CAU%2CNZ");
  });

  it("keeps regions as the only query contract key", () => {
    const weekly = buildWeeklyEndpoint(["USA", "EZ"]);
    const ics = buildIcsEndpoint(["USA", "EZ"]);

    expect(weekly).toContain("?regions=");
    expect(weekly).not.toContain("countries=");
    expect(ics).toContain("?regions=");
    expect(ics).not.toContain("countries=");
  });
});
