"use client";

import { useEffect, useMemo, useState } from "react";

type RegionOption = {
  code: "USA" | "EZ" | "UK" | "JP" | "CH" | "CA" | "AU" | "NZ";
  label: string;
};

const REGION_OPTIONS: RegionOption[] = [
  { code: "USA", label: "USA (USD)" },
  { code: "EZ", label: "Euro Zone (EUR)" },
  { code: "UK", label: "United Kingdom (GBP)" },
  { code: "JP", label: "Japan (JPY)" },
  { code: "CH", label: "Switzerland (CHF)" },
  { code: "CA", label: "Canada (CAD)" },
  { code: "AU", label: "Australia (AUD)" },
  { code: "NZ", label: "New Zealand (NZD)" }
];

const STORAGE_KEY = "macro_regions_v1";

type WeeklyResponse = {
  renderedText: string;
};

const parseRegionSetFromQuery = (): Set<string> => {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("regions");
  if (!raw) {
    return new Set(REGION_OPTIONS.map((r) => r.code));
  }
  return new Set(
    raw
      .split(",")
      .map((v) => v.trim().toUpperCase())
      .filter(Boolean)
  );
};

export default function Page() {
  const [selected, setSelected] = useState<Set<string>>(new Set(REGION_OPTIONS.map((r) => r.code)));
  const [renderedText, setRenderedText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const querySet = parseRegionSetFromQuery();
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const arr = JSON.parse(stored) as string[];
        if (arr.length > 0) {
          setSelected(new Set(arr));
          return;
        }
      } catch {
        // ignore invalid local storage payload
      }
    }
    setSelected(querySet);
  }, []);

  useEffect(() => {
    const values = [...selected].filter((value) => REGION_OPTIONS.some((r) => r.code === value));
    const params = new URLSearchParams(window.location.search);
    params.set("regions", values.join(","));
    const nextUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", nextUrl);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  }, [selected]);

  const regionsParam = useMemo(() => [...selected].join(","), [selected]);

  const onToggle = (code: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  const onAll = () => setSelected(new Set(REGION_OPTIONS.map((r) => r.code)));
  const onNone = () => setSelected(new Set());

  const onGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/weekly?regions=${encodeURIComponent(regionsParam)}`);
      if (!response.ok) {
        throw new Error(`API ${response.status}`);
      }
      const data = (await response.json()) as WeeklyResponse;
      setRenderedText(data.renderedText ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const onDownloadIcs = () => {
    window.location.href = `/api/weekly.ics?regions=${encodeURIComponent(regionsParam)}`;
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
        <div className="grid">
          {REGION_OPTIONS.map((option) => (
            <label key={option.code} className="check-item">
              <input
                type="checkbox"
                checked={selected.has(option.code)}
                onChange={() => onToggle(option.code)}
                aria-label={option.label}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Aktionen</h2>
        <div className="actions-inline">
          <button onClick={onGenerate} type="button" disabled={loading || selected.size === 0}>
            {loading ? "Generiere..." : "Wochenausblick generieren"}
          </button>
          <button onClick={onDownloadIcs} type="button" disabled={selected.size === 0}>
            .ICS herunterladen
          </button>
        </div>
        {error ? <p className="error">Fehler: {error}</p> : null}
      </section>

      <section className="panel">
        <h2>Output</h2>
        <pre className="strict-output">{renderedText || "Noch kein Output generiert."}</pre>
      </section>
    </main>
  );
}
