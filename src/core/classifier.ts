import type { CategoryAF } from "@/core/types";

const includesAny = (value: string, patterns: string[]): boolean => patterns.some((p) => value.includes(p));

const CATEGORIES: Record<CategoryAF, string[]> = {
  A: [
    "rate decision",
    "interest rate",
    "leitzins",
    "statement",
    "minutes",
    "press conference",
    "speech",
    "projections",
    "dot plot",
    "qe",
    "qt",
    "zinsentscheidung"
  ],
  B: ["cpi", "core cpi", "ppi", "pce", "inflation", "vpi"],
  C: ["nfp", "unemployment", "earnings", "jobless", "jolts", "adp", "arbeitslosenquote", "payroll"],
  D: ["gdp", "bip", "industrial production", "orders", "ism", "pmi", "konjunktur"],
  E: ["retail sales", "personal spending", "personal income", "consumer confidence", "consumer sentiment"],
  F: ["housing starts", "building permits"]
};

const TOP_PATTERNS = [
  "rate decision",
  "statement",
  "minutes",
  "press conference",
  "speech",
  "projections",
  "qe",
  "qt",
  "cpi",
  "pce",
  "nfp",
  "gdp",
  "bip",
  "pmi",
  "ism"
];

export const normalizeTitle = (title: string): string =>
  title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

export const classifyAF = (titleNormalized: string): CategoryAF | null => {
  const matches = (Object.keys(CATEGORIES) as CategoryAF[]).filter((category) => includesAny(titleNormalized, CATEGORIES[category]));
  if (matches.length !== 1) {
    return null;
  }
  return matches[0];
};

export const isTopEvent = (titleNormalized: string): boolean => includesAny(titleNormalized, TOP_PATTERNS);
