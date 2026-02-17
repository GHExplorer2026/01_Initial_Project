# WIDGET_E3_EVIDENCE.md

## Zweck
Nachweisartefakt für Gate E3 (`W-1106`) zur Widget-UI Vertical Slice Umsetzung.

## Run Metadata
- Datum: `2026-02-17`
- Runner/Environment: `WSL2 Ubuntu on Windows 11`
- Node Version: `v20.20.0`

## Scope
- Route: `GET /widget-preview` (UI Preview im bestehenden Projekt)
- Feed Consumer: `/api/widget-feed`
- Ziel: Widget Bar + Ticker Lane + Settings Basisfelder ohne Source-Fetch im Widget

## Implementierte Artefakte
- `src/app/widget-preview/page.tsx`
- `src/app/widgetPreviewClient.ts`
- `src/app/globals.css` (Widget-spezifische Klassen)
- `tests/widgetPreviewClient.test.ts`

## Verifizierte Vertragsanforderungen
1. Settings-basierte Feed-Query nutzt `regions` als Primary Parameter.
2. DatePreset-Mapping sendet `customFrom/customTo` nur bei `custom`.
3. Ticker zeigt `All Day` korrekt und rendert Missing Metrics als `n/a`.
4. Top-Event Hervorhebung basiert auf `isTopEvent || importance=high`.
5. Handle Mode ist vorhanden (`toggleBarEnabled=false` blendet Widget Bar aus, Reaktivierung möglich).

## Targeted Test Results
- `tests/api.widget-feed.route.test.ts`: `PASS (7/7)`
- `tests/widgetPreviewClient.test.ts`: `PASS (3/3)`
- `npm run typecheck`: `PASS`

## Einschränkungen
- Desktop-Runtime (always-on-top, draggable native window, tray) bleibt für getrenntes Widget-Projekt reserviert und ist nicht Teil dieser Preview-Route.

## Gate Decision
- E3 Status: `PASS`
- Freigabe für `W-1107`: `YES`
- Offene Punkte:
  - CI-Baseline für separates Widget-Projekt finalisieren.
