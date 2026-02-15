export type WeeklyResponse = {
  renderedText?: unknown;
  meta?: {
    sourceMode?: unknown;
    sourcesUsed?: unknown;
  };
};

export type NormalizedWeeklyResponse = {
  renderedText: string;
  sourceMode: "fixtures" | "live" | null;
  sourcesUsed: string[];
};

const normalizeSourceMode = (value: unknown): "fixtures" | "live" | null => {
  if (value === "fixtures" || value === "live") {
    return value;
  }
  return null;
};

const normalizeSourcesUsed = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  const cleaned = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  const unique = new Set<string>();
  for (const item of cleaned) {
    unique.add(item);
  }
  return [...unique].sort((a, b) => a.localeCompare(b));
};

export const normalizeWeeklyResponse = (input: WeeklyResponse): NormalizedWeeklyResponse => {
  const renderedText = typeof input.renderedText === "string" ? input.renderedText : "";
  const meta = input.meta ?? {};
  return {
    renderedText,
    sourceMode: normalizeSourceMode(meta.sourceMode),
    sourcesUsed: normalizeSourcesUsed(meta.sourcesUsed)
  };
};
