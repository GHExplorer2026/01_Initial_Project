export const APPROVED_TERTIARY_SOURCES = [
  "bls",
  "bea",
  "eurostat",
  "ons",
  "ecb",
  "fed",
  "boj",
  "boe",
  "snb",
  "statscan",
  "abs",
  "statsnz"
] as const;

export const isReutersEnabled = (): boolean => Boolean(process.env.REUTERS_API_KEY);
