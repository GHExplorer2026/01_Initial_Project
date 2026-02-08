export type SourceMode = "fixtures" | "live";

const normalize = (value: string | undefined): string => (value ?? "").trim().toLowerCase();

export const resolveSourceMode = (envValue = process.env.SOURCE_MODE): SourceMode =>
  normalize(envValue) === "live" ? "live" : "fixtures";
