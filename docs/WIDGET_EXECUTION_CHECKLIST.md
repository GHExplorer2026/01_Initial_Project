# WIDGET_EXECUTION_CHECKLIST.md

## Zweck
Minimaler, ausführbarer Startpfad für die nächste Widget-Execution-Phase auf Basis der finalen Verträge.

## Preconditions
1. `docs/WIDGET_FEED_CONTRACT.md` ist final (`v1.1`).
2. `docs/WIDGET_SETTINGS_CONTRACT.md` ist final (`v1`).
3. `docs/WIDGET_STYLE_GUIDE.md` und `docs/WIDGET_STYLE_GUIDE_ALIGNMENT.md` sind final.
4. Option C Architektur bleibt unverändert (Feed Provider getrennt vom Widget UI Projekt).

## Gate E0: Execution Ready
- Exit Kriterien:
  - Verträge und Style-Mapping sind freigegeben.
  - Backlog für Vertical Slice ist spezifiziert.
- Artefakte:
  - `docs/WIDGET_IMPLEMENTATION_PLAN.md`
  - `docs/WIDGET_SPLIT_DELIVERY_PLAYBOOK.md`
  - dieses Dokument

## Gate E1: Project Boundary Setup
- Muss:
  - neues Desktop-UI-Projekt (oder klarer Monorepo Bereich) ist angelegt.
  - Schnittstellen zum Feed Provider sind dokumentiert.
  - keine Source-Fetch-Logik im Widget.
- Checks:
  - Boundary-Review bestanden.
  - Security-Baseline für Secrets/Logs dokumentiert.

## Gate E2: Feed Integration Slice
- Muss:
  - Widget kann `GET /api/widget-feed` konsumieren.
  - Settings-zu-Query Mapping entspricht Contract.
  - `regions` primary, kein `countries`-Sendepfad.
- Checks:
  - Contract Tests grün.
  - Fehlerpfade (`empty`, `error`) sichtbar, ohne sensitive Details.

## Gate E3: UI Vertical Slice
- Muss:
  - Widget Bar + Ticker Lane + Settings Basisfelder.
  - `All Day` Rendering.
  - `isTopEvent` visuell fett.
  - Missing Metrics als `n/a`.
- Checks:
  - UI Contract Tests grün.
  - Accessibility-Minimum (Kontrast/Keyboard) erfüllt.

## Gate E4: Time and Filter Hardening
- Muss:
  - Date Presets korrekt (`yesterday|today|tomorrow|this_week|next_week|custom`).
  - Past-Regel korrekt mit `yesterday`-Ausnahme.
  - UTC intern, lokale Anzeige via Windows Timezone, DST validiert.
- Checks:
  - DST Matrix Tests grün.
  - Filter-Regressionen grün.

## Gate E5: Release Candidate Readiness
- Muss:
  - Last Good Cache und Polling Backoff (Soll) bewertet und entweder umgesetzt oder explizit deferred.
  - Security/Compliance Checklist abgeschlossen.
  - Rollback-Pfad dokumentiert und getestet.
- Checks:
  - Vollständiger Gate-Report mit Go/No-Go Entscheidung.

## Minimal Teststrategie (token-optimiert)
1. Während Entwicklung nur zielgerichtete Tests auf geänderte Module.
2. Full Suite nur an Gate E5.
3. Fixture-first, kein Live-Netz in automatisierten Tests.
