import type { RawSourceEvent } from "@/core/types";

export type SourceFetchResult = {
  ok: boolean;
  events: RawSourceEvent[];
  error?: string;
};
