import { describe, expect, it } from "vitest";
import { parseScopeSelection, ScopeConflictError } from "@/core/scope";
import { REGION_ORDER } from "@/core/types";

describe("parseScopeSelection", () => {
  it("parses regions as primary input", () => {
    const params = new URLSearchParams("regions=USA,EZ,UK");
    const scope = parseScopeSelection(params);
    expect(scope.regions).toEqual(["USA", "EZ", "UK"]);
    expect(scope.usedDeprecatedCountriesAlias).toBe(false);
  });

  it("parses deprecated countries alias", () => {
    const params = new URLSearchParams("countries=USD,EUR,GBP");
    const scope = parseScopeSelection(params);
    expect(scope.regions).toEqual(["USA", "EZ", "UK"]);
    expect(scope.usedDeprecatedCountriesAlias).toBe(true);
  });

  it("throws on conflicting parameters", () => {
    const params = new URLSearchParams("regions=USA&countries=EUR");
    expect(() => parseScopeSelection(params)).toThrow(ScopeConflictError);
  });

  it("accepts matching regions and deprecated countries together", () => {
    const params = new URLSearchParams("regions=USA,EZ,UK&countries=USD,EUR,GBP");
    const scope = parseScopeSelection(params);
    expect(scope.regions).toEqual(["USA", "EZ", "UK"]);
    expect(scope.usedDeprecatedCountriesAlias).toBe(false);
  });

  it("drops invalid and duplicate deprecated countries values", () => {
    const params = new URLSearchParams("countries=USD,USD,EUR,XXX,GBP");
    const scope = parseScopeSelection(params);
    expect(scope.regions).toEqual(["USA", "EZ", "UK"]);
    expect(scope.usedDeprecatedCountriesAlias).toBe(true);
  });

  it("uses all regions by default when no query params are provided", () => {
    const params = new URLSearchParams("");
    const scope = parseScopeSelection(params);
    expect(scope.regions).toEqual(REGION_ORDER);
    expect(scope.usedDeprecatedCountriesAlias).toBe(false);
  });

  it("accepts same regions/countries sets even if order differs", () => {
    const params = new URLSearchParams("regions=USA,EZ,UK&countries=GBP,USD,EUR");
    const scope = parseScopeSelection(params);
    expect(scope.regions).toEqual(["USA", "EZ", "UK"]);
    expect(scope.usedDeprecatedCountriesAlias).toBe(false);
  });

  it("normalizes regions parameter with lowercase, spaces and duplicates", () => {
    const params = new URLSearchParams("regions= usa, ez ,uk,USA ");
    const scope = parseScopeSelection(params);
    expect(scope.regions).toEqual(["USA", "EZ", "UK"]);
    expect(scope.usedDeprecatedCountriesAlias).toBe(false);
  });

  it("normalizes deprecated countries alias with lowercase and spaces", () => {
    const params = new URLSearchParams("countries= usd, eur , gbp ");
    const scope = parseScopeSelection(params);
    expect(scope.regions).toEqual(["USA", "EZ", "UK"]);
    expect(scope.usedDeprecatedCountriesAlias).toBe(true);
  });

  it("falls back to all regions when primary regions contains only invalid values", () => {
    const params = new URLSearchParams("regions=foo,bar");
    const scope = parseScopeSelection(params);
    expect(scope.regions).toEqual(REGION_ORDER);
    expect(scope.usedDeprecatedCountriesAlias).toBe(false);
  });

  it("uses deprecated countries when regions are invalid but countries are valid", () => {
    const params = new URLSearchParams("regions=foo&countries=USD,EUR");
    const scope = parseScopeSelection(params);
    expect(scope.regions).toEqual(["USA", "EZ"]);
    expect(scope.usedDeprecatedCountriesAlias).toBe(true);
  });
});
