"use client";

import { useEffect, useMemo, useState } from "react";
import type { RegionCode } from "@/core/types";
import {
  REGION_OPTIONS,
  STORAGE_KEY,
  allRegionsSelection,
  resolveInitialRegionSelection,
  serializeRegionsParam,
  toggleRegionSelection
} from "@/app/scopeState";
import { buildIcsEndpoint, buildWeeklyEndpoint } from "@/app/uiRequests";

type WeeklyResponse = {
  renderedText: string;
  meta?: {
    sourceMode?: "fixtures" | "live";
    sourcesUsed?: string[];
  };
};

export default function Page() {
  const [selected, setSelected] = useState<RegionCode[]>(allRegionsSelection);
  const [renderedText, setRenderedText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [sourceMode, setSourceMode] = useState<"fixtures" | "live" | null>(null);
  const [sourcesUsed, setSourcesUsed] = useState<string[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const fromStorage = localStorage.getItem(STORAGE_KEY);
    const initial = resolveInitialRegionSelection(window.location.search, fromStorage);
    setSelected(initial);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    const values = [...selected];
    const params = new URLSearchParams(window.location.search);
    params.set("regions", serializeRegionsParam(values));
    const nextSearch = params.toString();
    const nextUrl = nextSearch ? `${window.location.pathname}?${nextSearch}` : window.location.pathname;
    window.history.replaceState(null, "", nextUrl);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  }, [hydrated, selected]);

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const onToggle = (code: RegionCode) => {
    setSelected((prev) => toggleRegionSelection(prev, code));
  };

  const onAll = () => setSelected(allRegionsSelection());
  const onNone = () => setSelected([]);

  const onGenerate = async () => {
    if (selected.length === 0) {
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(buildWeeklyEndpoint(selected));
      if (!response.ok) {
        throw new Error(`API ${response.status}`);
      }
      const data = (await response.json()) as WeeklyResponse;
      setRenderedText(data.renderedText ?? "");
      setSourceMode(data.meta?.sourceMode ?? null);
      setSourcesUsed(Array.isArray(data.meta?.sourcesUsed) ? data.meta?.sourcesUsed : []);
      setHasGenerated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const onDownloadIcs = () => {
    if (selected.length === 0) {
      return;
    }
    window.location.href = buildIcsEndpoint(selected);
  };

  return (
    <main className="page-shell">
      <section className="panel">
        <h1>Macro Events Weekly Outlook</h1>
        <p className="sub">Deterministic strict output and Outlook ICS export</p>
      </section>

      <section className="panel">
        <h2>Country Scope</h2>
        <div className="actions-inline">
          <button onClick={onAll} type="button">
            Alle
          </button>
          <button onClick={onNone} type="button">
            Keine
          </button>
        </div>
        <fieldset>
          <legend className="sr-only">Region selection</legend>
          <div className="grid">
            {REGION_OPTIONS.map((option) => {
              const inputId = `region-${option.code.toLowerCase()}`;
              return (
                <label key={option.code} className="check-item" htmlFor={inputId}>
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={selectedSet.has(option.code)}
                    onChange={() => onToggle(option.code)}
                    aria-label={option.label}
                  />
                  <span>{option.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </section>

      <section className="panel">
        <h2>Aktionen</h2>
        <div className="actions-inline">
          <button onClick={onGenerate} type="button" disabled={loading || selected.length === 0}>
            {loading ? "Generiere..." : "Wochenausblick generieren"}
          </button>
          <button onClick={onDownloadIcs} type="button" disabled={selected.length === 0}>
            .ICS herunterladen
          </button>
        </div>
        {hasGenerated ? (
          <p className="meta-line" aria-live="polite">
            <strong>Mode:</strong> {sourceMode ?? "unknown"}{" "}
            <span className="meta-sep">|</span> <strong>Quellen:</strong>{" "}
            {sourcesUsed.length > 0 ? sourcesUsed.join(", ") : "none"}
          </p>
        ) : null}
        {error ? (
          <p className="error" role="alert">
            Fehler: {error}
          </p>
        ) : null}
      </section>

      <section className="panel">
        <h2>Strict Output</h2>
        {!hasGenerated ? <p className="sub">Noch kein Output generiert.</p> : null}
        <pre className="strict-output" aria-label="Strict output block">
          {renderedText}
        </pre>
      </section>
    </main>
  );
}
