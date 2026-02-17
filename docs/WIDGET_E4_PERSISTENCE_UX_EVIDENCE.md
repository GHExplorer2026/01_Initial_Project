# WIDGET_E4_PERSISTENCE_UX_EVIDENCE.md

## Zweck
Nachweis für die Schritte `W-1112` und `W-1113` im bestehenden Widget-Preview-Slice.

## Scope
- Runtime-Settings Persistenz mit Versionierung/Migration.
- Deterministische Empty/Error/Loading/Ready State-Logik für Ticker-Lane.

## Implementierte Änderungen
- `src/app/widgetPreviewClient.ts`
  - `WIDGET_SETTINGS_STORAGE_KEY`, `WIDGET_SETTINGS_VERSION`
  - `normalizeWidgetSettings`
  - `parseStoredWidgetSettings` (inkl. Legacy-Payload Support)
  - `serializeWidgetSettings` (versionierte Envelope)
  - `deriveWidgetLaneState`
- `src/app/widget-preview/page.tsx`
  - localStorage Hydration/Persistenz via `safeGetStorageValue`/`safeSetStorageValue`
  - gerenderte Lane-State-Ausgabe über `deriveWidgetLaneState`
- `tests/widgetPreviewClient.test.ts`
  - Migrations-/Normalisierungs-Test
  - Serialisierungs-/Restore-Test
  - Lane-State-Testmatrix

## Verifikation
- `npm run contract:widget-feed` -> `PASS (13/13)`
- `npm run typecheck` -> `PASS`

## Gate Decision
- `W-1112`: `PASS`
- `W-1113`: `PASS`
- Hinweis: `W-1111` bleibt separat blockiert (Port-Bind-EPERM im Agent-Shell-Kontext).
