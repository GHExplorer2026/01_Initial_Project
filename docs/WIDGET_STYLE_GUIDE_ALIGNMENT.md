# WIDGET_STYLE_GUIDE_ALIGNMENT.md

## Ziel
Dieser Abgleich dokumentiert, welche Vorgaben aus `docs/WIDGET_STYLE_GUIDE.md` (v1.1) in die führenden Widget-Verträge übernommen wurden.

## Führende Priorität
1. `docs/WIDGET_SETTINGS_CONTRACT.md` (persistierte Settings)
2. `docs/WIDGET_FEED_CONTRACT.md` (Feed Request/Response Regeln)
3. `docs/WIDGET_IMPLEMENTATION_PLAN.md` (Scope, Delivery, Gates)
4. `docs/WIDGET_STYLE_GUIDE.md` (UI/Style/Interaction Profile)

## Übernahmeentscheidung

### Voll übernommen
- Produktprinzipien: keine erfundenen Werte, UTC intern, lokales Rendering, kein direkter Source Fetch.
- Query-Mapping: `regions` als Primary Parameter.
- Ticker-Inhalte: Zeit/All Day, Region, Titel, `Actual/Forecast/Previous`, Missing=`n/a`.
- Top-Event Visual: fett.
- Past-Regel: Vergangenheit nur bei `datePreset=yesterday`.
- Sortierungsregel: Feed-Reihenfolge bleibt nach Filterung erhalten.
- Status-States: `loading`, `empty`, `error` ohne sensitiven Debug-Output.
- A11y Leitlinien: Bedeutung nicht nur über Farbe, Kontrastpflicht.

### Übernommen mit Präzisierung
- Deprecated Alias:
  - Provider akzeptiert `countries` nur kompatibel.
  - Widget-Consumer sendet ausschließlich `regions`.
- `countryLabel` Nutzung:
  - Lane nutzt primär `region` (platzsparend).
  - `countryLabel` nur Tooltip/Detail.
- `toggleBarEnabled=false`:
  - Handle Mode ist verpflichtend als reaktivierbarer Einstieg.

### Bewusst nicht als v1-Contract persistiert
- Theme Toggle (Dark/Light) bleibt Runtime-Feature.
- Play/Pause oder Hover-Pause bleibt Runtime-Feature.
- Weitere UI Toggles nur mit späterem Contract-Upgrade (`v2+`).

### Als Soll/Kann belassen
- Snap-to-edge, Multi-Monitor Restore, Hotkey, Dichteprofile.
- Feed Quality Indicator (sourceMode/parserVersion/sourcesUsed) als Soll.

## Vertragsupdates durch diesen Abgleich
- `docs/WIDGET_FEED_CONTRACT.md`
  - Consumer Request Profile ergänzt.
  - `countriesFilter` aus Widget-Request-Profil entfernt.
  - Reihenfolge- und Lane-Label-Regeln ergänzt.
- `docs/WIDGET_SETTINGS_CONTRACT.md`
  - Allowed Sets ergänzt.
  - Runtime-only Toggles explizit ausgeschlossen.
  - Handle-Mode und Timezone-Fallback-Regel ergänzt.
- `docs/WIDGET_IMPLEMENTATION_PLAN.md`
  - UI Komponentenprofil, Status-/Interaktionsregeln und Style-Guide-Referenz ergänzt.
- `skills/*`
  - Widget-Skills um Style-Guide-Input und neue Guardrails erweitert.

## Ergebnis
Der Style Guide ist kompatibel mit der bestehenden Option-C Architektur.
Die übernommenen Regeln sind in den führenden Vertragsdokumenten verankert und für die nächste Implementierungsphase direkt nutzbar.
