import { describe, expect, it } from "vitest";

import {
  allRegionsSelection,
  parseRegionsFromStorageValue,
  parseRegionsParamFromSearch,
  resolveInitialRegionSelection,
  serializeRegionsParam,
  toggleRegionSelection
} from "@/app/scopeState";

describe("ui scope state helpers", () => {
  it("prefers regions query over storage payload", () => {
    const resolved = resolveInitialRegionSelection("?regions=USA,EZ", JSON.stringify(["UK", "JP"]));
    expect(resolved).toEqual(["USA", "EZ"]);
  });

  it("respects explicit empty regions query", () => {
    const resolved = resolveInitialRegionSelection("?regions=", JSON.stringify(["USA", "EZ"]));
    expect(resolved).toEqual([]);
  });

  it("falls back to storage when query param is absent", () => {
    const resolved = resolveInitialRegionSelection("", JSON.stringify(["UK", "USA"]));
    expect(resolved).toEqual(["USA", "UK"]);
  });

  it("falls back to all regions when storage is invalid and query is absent", () => {
    const resolved = resolveInitialRegionSelection("", "{invalid");
    expect(resolved).toEqual(allRegionsSelection());
  });

  it("normalizes and serializes in deterministic region order", () => {
    expect(serializeRegionsParam(["UK", "USA", "EZ"])).toBe("USA,EZ,UK");
  });

  it("toggles region selection while preserving canonical order", () => {
    expect(toggleRegionSelection(["EZ", "UK"], "USA")).toEqual(["USA", "EZ", "UK"]);
    expect(toggleRegionSelection(["USA", "EZ"], "USA")).toEqual(["EZ"]);
  });

  it("parses query regions with dedupe, casing and invalid filtering", () => {
    const parsed = parseRegionsParamFromSearch("?regions= usa,ez,USA,foo ");
    expect(parsed).toEqual({
      hasRegionsParam: true,
      regions: ["USA", "EZ"]
    });
  });

  it("returns null for non-array storage payload", () => {
    expect(parseRegionsFromStorageValue('{"x":1}')).toBeNull();
  });
});
