# WIDGET_SETTINGS_CONTRACT.md

## Contract
- Version: `1`
- Scope: lokale Widget Einstellungen
- Persistenz: lokale Datei, versioniert, migrationsfähig

## Required Fields
- `datePreset: "yesterday" | "today" | "tomorrow" | "this_week" | "next_week" | "custom"`
- `customFrom?: string`
- `customTo?: string`
- `countries: string[]`
- `currencies: string[]`
- `importanceLevels: Array<"unknown" | "low" | "medium" | "high">`
- `toggleBarEnabled: boolean`
- `alwaysOnTop: boolean`
- `transparency: number` (0..100)
- `tickerSpeed: "slow" | "normal" | "fast"`
- `timezoneMode: "windows" | "berlin_fallback"`

## Defaults
- `datePreset`: `today`
- `countries`: alle erlaubten Regionen
- `currencies`: alle erlaubten Währungen
- `importanceLevels`: alle
- `toggleBarEnabled`: `true`
- `alwaysOnTop`: `false`
- `transparency`: `90`
- `tickerSpeed`: `normal`
- `timezoneMode`: `windows`

## Rules
1. Wenn `datePreset != custom`, dann `customFrom/customTo` ignorieren.
2. Wenn `datePreset=custom`, müssen beide Felder valide sein.
3. Vergangenheit ohne `yesterday` nicht anzeigen.
4. Ungültige Felder werden auf Default normalisiert und geloggt.

## Migration
- Jede neue Version erhält eine explizite Migrationstabelle.
- Unbekannte Versionen werden in `safe mode` normalisiert.
