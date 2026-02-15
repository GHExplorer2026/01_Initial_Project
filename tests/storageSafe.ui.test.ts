import { describe, expect, it } from "vitest";

import { safeGetStorageValue, safeSetStorageValue, type StorageLike } from "@/app/storageSafe";

describe("storage safe helpers", () => {
  it("returns value when getItem succeeds", () => {
    const storage: StorageLike = {
      getItem: () => "x",
      setItem: () => {}
    };
    expect(safeGetStorageValue(storage, "k")).toBe("x");
  });

  it("returns null when getItem throws", () => {
    const storage: StorageLike = {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {}
    };
    expect(safeGetStorageValue(storage, "k")).toBeNull();
  });

  it("returns true when setItem succeeds", () => {
    const storage: StorageLike = {
      getItem: () => null,
      setItem: () => {}
    };
    expect(safeSetStorageValue(storage, "k", "v")).toBe(true);
  });

  it("returns false when setItem throws", () => {
    const storage: StorageLike = {
      getItem: () => null,
      setItem: () => {
        throw new Error("denied");
      }
    };
    expect(safeSetStorageValue(storage, "k", "v")).toBe(false);
  });
});
