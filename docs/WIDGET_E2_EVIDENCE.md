# WIDGET_E2_EVIDENCE.md

## Zweck
Nachweisartefakt für Gate E2 (`W-1105`) zur Feed-Integration.

## Run Metadata
- Datum: `2026-02-17`
- Commit SHA: `1fa8686` (baseline before W-1105 implementation commit)
- Runner/Environment: `WSL2 Ubuntu on Windows 11`
- Node Version: `v20.20.0` (via `PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH"`)

## Scope
- Endpoint: `GET /api/widget-feed`
- Contract Version: `v1.1`

## Test Results
- Contract Suite: `tests/api.widget-feed.route.test.ts`
- Ergebnis: `PASS (7/7)`
- Fehlgeschlagene Fälle: `0`

## Verified Query Cases
1. `regions` ist primary; `countries` wird nur kompatibel toleriert.
2. `datePreset=today` filtert vergangene exact-time Events aus.
3. `datePreset=yesterday` erlaubt vergangene Events des Vortags.
4. `currencies` + `importance` Filter wirken deterministisch.
5. Ungültiger `custom`-Range liefert `400`.

## Verified Response Cases
1. `meta` enthält `feedVersion`, `timezoneReference`, `sourceMode`, `sourcesUsed`, `parserVersion`.
2. Event-Felder enthalten `eventId`, `datetimeUTC`, `timeKind`, `region`, `countryLabel`, `currency`, Metrics.
3. Fehlerpfade liefern definierte Fehlerklasse ohne sensitive Payload.

## Error Contract Evidence
- `400` Beispiel: `regions and countries parameters conflict`, `invalid custom date range`
- `500` Beispiel: `failed to generate widget feed` (bei orchestrator failure)
- Sensitive Data Check: keine Stacktraces oder Rohpayloads im JSON-Error.

## Determinism Notes
- Fixture-only execution confirmed: `YES` (orchestrator in Route-Tests gemockt, kein Live-Netz).
- Repeat-run consistency confirmed: `YES` (mehrfacher Lauf konsistent grün).

## Gate Decision
- E2 Status: `PASS`
- Freigabe für `W-1106`: `YES`
- Offene Punkte:
  - Full-suite `verify:release` ist für späteres Gate vorgesehen, nicht Bestandteil des minimalen W-1105-Ziels.
