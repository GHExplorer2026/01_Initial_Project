import { describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/healthz/route";

describe("GET /api/healthz", () => {
  it("returns status payload with source mode and timestamp", async () => {
    vi.stubEnv("SOURCE_MODE", "live");

    const response = await GET();
    const payload = (await response.json()) as {
      status: string;
      sourceMode: string;
      generatedAtUTC: string;
    };

    expect(response.status).toBe(200);
    expect(payload.status).toBe("ok");
    expect(payload.sourceMode).toBe("live");
    expect(Number.isNaN(Date.parse(payload.generatedAtUTC))).toBe(false);

    vi.unstubAllEnvs();
  });
});
