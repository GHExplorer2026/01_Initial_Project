"use client";

import { useEffect, useMemo, useState } from "react";
import { REGION_OPTIONS } from "@/app/scopeState";
import { safeGetStorageValue, safeSetStorageValue } from "@/app/storageSafe";
import {
  CURRENCIES,
  DEFAULT_WIDGET_SETTINGS,
  IMPORTANCE_LEVELS,
  buildWidgetFeedEndpoint,
  deriveWidgetLaneState,
  parseStoredWidgetSettings,
  serializeWidgetSettings,
  toTickerItems,
  WIDGET_SETTINGS_STORAGE_KEY,
  type WidgetFeedResponse,
  type WidgetSettings
} from "@/app/widgetPreviewClient";

const speedClass = (speed: WidgetSettings["tickerSpeed"]): string => {
  if (speed === "slow") {
    return "widget-ticker-track slow";
  }
  if (speed === "fast") {
    return "widget-ticker-track fast";
  }
  return "widget-ticker-track";
};

export default function WidgetPreviewPage() {
  const [settings, setSettings] = useState<WidgetSettings>(DEFAULT_WIDGET_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feed, setFeed] = useState<WidgetFeedResponse | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const tickerItems = useMemo(() => (feed ? toTickerItems(feed.events) : []), [feed]);
  const laneState = deriveWidgetLaneState({
    loading,
    error,
    hasFeed: feed !== null,
    eventCount: tickerItems.length
  });

  useEffect(() => {
    const raw = safeGetStorageValue(localStorage, WIDGET_SETTINGS_STORAGE_KEY);
    setSettings(parseStoredWidgetSettings(raw));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    safeSetStorageValue(localStorage, WIDGET_SETTINGS_STORAGE_KEY, serializeWidgetSettings(settings));
  }, [hydrated, settings]);

  const setPartial = (partial: Partial<WidgetSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const toggleCountry = (code: (typeof REGION_OPTIONS)[number]["code"]) => {
    setSettings((prev) => {
      const has = prev.countries.includes(code);
      return {
        ...prev,
        countries: has ? prev.countries.filter((c) => c !== code) : [...prev.countries, code]
      };
    });
  };

  const toggleCurrency = (currency: (typeof CURRENCIES)[number]) => {
    setSettings((prev) => {
      const has = prev.currencies.includes(currency);
      return {
        ...prev,
        currencies: has ? prev.currencies.filter((c) => c !== currency) : [...prev.currencies, currency]
      };
    });
  };

  const toggleImportance = (importance: (typeof IMPORTANCE_LEVELS)[number]) => {
    setSettings((prev) => {
      const has = prev.importanceLevels.includes(importance);
      return {
        ...prev,
        importanceLevels: has ? prev.importanceLevels.filter((i) => i !== importance) : [...prev.importanceLevels, importance]
      };
    });
  };

  const loadFeed = async () => {
    if (settings.countries.length === 0) {
      setError("Bitte mindestens eine Region auswählen.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const endpoint = buildWidgetFeedEndpoint(settings);
      const response = await fetch(endpoint);
      const payload = (await response.json()) as WidgetFeedResponse | { error: string };

      if (!response.ok) {
        setFeed(null);
        setError((payload as { error?: string }).error ?? "Feed nicht erreichbar");
        return;
      }

      setFeed(payload as WidgetFeedResponse);
    } catch {
      setFeed(null);
      setError("Feed nicht erreichbar");
    } finally {
      setLoading(false);
    }
  };

  if (!settings.toggleBarEnabled) {
    return (
      <main className="page-shell">
        <section className="panel widget-handle-panel">
          <button type="button" onClick={() => setPartial({ toggleBarEnabled: true })}>
            Widget anzeigen
          </button>
          <p className="sub">Handle Mode aktiv</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="panel widget-bar" style={{ opacity: settings.transparency / 100 }}>
        <div className="widget-bar-main">
          <h1>Economic Events Ticker</h1>
          <p className="sub">Widget Preview · Feed Consumer</p>
        </div>

        <div className="widget-control-cluster">
          <button type="button" onClick={() => setShowSettings((v) => !v)}>
            Settings
          </button>
          <button type="button" onClick={() => setPaused((v) => !v)}>
            {paused ? "Play" : "Pause"}
          </button>
          <button type="button" onClick={() => setPartial({ toggleBarEnabled: false })}>
            Hide Bar
          </button>
          <button type="button" onClick={loadFeed} disabled={loading}>
            {loading ? "Lade..." : "Refresh"}
          </button>
        </div>
      </section>

      {showSettings ? (
        <section className="panel">
          <h2>Settings Panel</h2>
          <div className="grid">
            <label className="check-item" htmlFor="date-preset">
              <span>Date Preset</span>
              <select
                id="date-preset"
                value={settings.datePreset}
                onChange={(e) => setPartial({ datePreset: e.currentTarget.value as WidgetSettings["datePreset"] })}
              >
                <option value="yesterday">Yesterday</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="this_week">This Week</option>
                <option value="next_week">Next Week</option>
                <option value="custom">Custom Dates</option>
              </select>
            </label>

            {settings.datePreset === "custom" ? (
              <>
                <label className="check-item" htmlFor="custom-from">
                  <span>Custom From</span>
                  <input
                    id="custom-from"
                    type="date"
                    value={settings.customFrom ?? ""}
                    onChange={(e) => setPartial({ customFrom: e.currentTarget.value })}
                  />
                </label>
                <label className="check-item" htmlFor="custom-to">
                  <span>Custom To</span>
                  <input
                    id="custom-to"
                    type="date"
                    value={settings.customTo ?? ""}
                    onChange={(e) => setPartial({ customTo: e.currentTarget.value })}
                  />
                </label>
              </>
            ) : null}

            <label className="check-item" htmlFor="ticker-speed">
              <span>Ticker Speed</span>
              <select
                id="ticker-speed"
                value={settings.tickerSpeed}
                onChange={(e) => setPartial({ tickerSpeed: e.currentTarget.value as WidgetSettings["tickerSpeed"] })}
              >
                <option value="slow">slow</option>
                <option value="normal">normal</option>
                <option value="fast">fast</option>
              </select>
            </label>

            <label className="check-item" htmlFor="transparency">
              <span>Transparency ({settings.transparency})</span>
              <input
                id="transparency"
                type="range"
                min={0}
                max={100}
                value={settings.transparency}
                onChange={(e) => setPartial({ transparency: Number(e.currentTarget.value) })}
              />
            </label>
          </div>

          <fieldset>
            <legend>Regions</legend>
            <div className="grid">
              {REGION_OPTIONS.map((option) => (
                <label key={option.code} className="check-item" htmlFor={`widget-region-${option.code}`}>
                  <input
                    id={`widget-region-${option.code}`}
                    type="checkbox"
                    checked={settings.countries.includes(option.code)}
                    onChange={() => toggleCountry(option.code)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Currencies</legend>
            <div className="grid">
              {CURRENCIES.map((currency) => (
                <label key={currency} className="check-item" htmlFor={`widget-currency-${currency}`}>
                  <input
                    id={`widget-currency-${currency}`}
                    type="checkbox"
                    checked={settings.currencies.includes(currency)}
                    onChange={() => toggleCurrency(currency)}
                  />
                  <span>{currency}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Importance</legend>
            <div className="grid">
              {IMPORTANCE_LEVELS.map((level) => (
                <label key={level} className="check-item" htmlFor={`widget-importance-${level}`}>
                  <input
                    id={`widget-importance-${level}`}
                    type="checkbox"
                    checked={settings.importanceLevels.includes(level)}
                    onChange={() => toggleImportance(level)}
                  />
                  <span>{level}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </section>
      ) : null}

      <section className="panel widget-ticker-panel">
        <div className="widget-ticker-header">
          <h2>Ticker Lane</h2>
          {feed ? (
            <p className="meta-line">
              <strong>Mode:</strong> {feed.meta.sourceMode} <span className="meta-sep">|</span> <strong>Quellen:</strong>{" "}
              {feed.meta.sourcesUsed.join(", ")}
            </p>
          ) : null}
        </div>

        {laneState === "error" ? (
          <p className="error" role="alert">
            {error}
          </p>
        ) : null}
        {laneState === "idle" ? <p className="sub">Noch kein Feed geladen.</p> : null}
        {laneState === "loading" ? <p className="sub">Feed wird geladen...</p> : null}
        {laneState === "empty" ? <p className="sub">Keine Events im aktuellen Filter</p> : null}

        {laneState === "ready" ? (
          <div className="widget-ticker-lane" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            <div className={`${speedClass(settings.tickerSpeed)}${paused ? " paused" : ""}`}>
              {tickerItems.map((item) => (
                <span key={item.id} className={`widget-ticker-item${item.isTop ? " top" : ""}`}>
                  {item.text}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
