import fs from "node:fs/promises";
import path from "node:path";
import type { RegionCode, RawSourceEvent } from "@/core/types";
import type { SourceFetchResult } from "@/server/sources/types";

const fixturePath = (name: string): string => path.join(process.cwd(), "src", "server", "fixtures", name);

const inWeek = (date: string, weekStart: string, weekEnd: string): boolean => date >= weekStart && date <= weekEnd;

export const readFixtureEvents = async (
  fixtureFile: string,
  weekStart: string,
  weekEnd: string,
  allowedRegions: RegionCode[]
): Promise<SourceFetchResult> => {
  try {
    const file = await fs.readFile(fixturePath(fixtureFile), "utf8");
    const parsed = JSON.parse(file) as RawSourceEvent[];
    const allow = new Set(allowedRegions);

    const events = parsed.filter((event) => {
      if (event.region && !allow.has(event.region)) {
        return false;
      }
      return inWeek(event.date, weekStart, weekEnd);
    });

    return {
      ok: true,
      events
    };
  } catch (error) {
    return {
      ok: false,
      events: [],
      error: error instanceof Error ? error.message : "unknown fixture error"
    };
  }
};

export const decodeHtml = (value: string): string =>
  value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

export const stripHtml = (value: string): string => decodeHtml(value.replace(/<[^>]+>/g, " "));

export const toBerlinDateTime = (input: Date): { date: string; time: string } => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(input);

  const get = (type: Intl.DateTimeFormatPartTypes): string => parts.find((part) => part.type === type)?.value ?? "";

  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour")}:${get("minute")}`
  };
};

const DEFAULT_SOURCE_FETCH_TIMEOUT_MS = 15_000;

export const resolveSourceFetchTimeoutMs = (): number => {
  const raw = process.env.SOURCE_FETCH_TIMEOUT_MS;
  if (!raw) {
    return DEFAULT_SOURCE_FETCH_TIMEOUT_MS;
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return DEFAULT_SOURCE_FETCH_TIMEOUT_MS;
  }

  return Math.trunc(parsed);
};

export const fetchWithTimeout = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const controller = new AbortController();
  const timeoutMs = resolveSourceFetchTimeoutMs();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`source request timeout after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
};
