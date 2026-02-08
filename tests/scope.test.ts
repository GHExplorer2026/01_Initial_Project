import { describe, expect, it } from "vitest";
import { parseScopeSelection, ScopeConflictError } from "@/core/scope";

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
});
