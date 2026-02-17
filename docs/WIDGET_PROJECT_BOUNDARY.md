# WIDGET_PROJECT_BOUNDARY.md

## Ziel
Verbindliche Trennung zwischen bestehendem Feed-Provider (`01_Initial_Project`) und neuem Desktop-Widget-UI-Projekt.

## Boundary

### Feed Provider (bestehendes Projekt)
- Verantwortlich für Source-Fetch, Governance, Normalisierung, Priorisierung.
- Stellt stabilen Feed nach `docs/WIDGET_FEED_CONTRACT.md` bereit.
- Erzwingt deterministische Regeln für Zeit, Scope, Importance/Top-Konsistenz und No-Hallucination.

### Widget UI Projekt (neu)
- Verantwortlich für Desktop-UX, Fensterverhalten, Settings, Ticker-Rendering.
- Konsumiert ausschließlich den Feed, keine direkte Source-Anbindung.
- Persistiert ausschließlich Settings gemäß `docs/WIDGET_SETTINGS_CONTRACT.md`.

## Schnittstellenregeln
1. Widget sendet nur `regions` als Scope-Parameter.
2. Widget nutzt `datePreset/customFrom/customTo` strikt gemäß Contract.
3. Widget behandelt fehlende Metrics immer als `n/a`.
4. Widget sortiert Feed-Daten nicht neu, außer explizit dokumentiert.

## CI Baseline für neues Widget-Projekt

### Required Gates
1. Lint
2. Typecheck
3. Unit (inkl. Filter-/Zeitlogik)
4. Contract Integration (Feed Consumer gegen Fixtures)
5. Build

### Required Test Slices
1. Settings Normalisierung und Defaults.
2. DatePreset/Past-Regel inkl. `yesterday`-Ausnahme.
3. All-Day Rendering.
4. Top-Event-Visualisierung (`importance=high` <=> fett).
5. Error/Empty-States ohne sensitive Daten.

## Security Baseline
1. Keine Secrets im Repo oder in UI-Logs.
2. Runtime-Secrets nur via Env/OS Secret Store.
3. Keine Roh-Error-Payloads im UI.

## Release Baseline
1. Gate Evidence pro Run archivieren.
2. Go/No-Go nur bei grünen Required Gates.
3. Rollback-Pfad vor RC dokumentiert und geprüft.

## Referenzen
- `docs/WIDGET_IMPLEMENTATION_PLAN.md`
- `docs/WIDGET_FEED_CONTRACT.md`
- `docs/WIDGET_SETTINGS_CONTRACT.md`
- `docs/WIDGET_STYLE_GUIDE.md`
- `docs/WIDGET_EXECUTION_CHECKLIST.md`
