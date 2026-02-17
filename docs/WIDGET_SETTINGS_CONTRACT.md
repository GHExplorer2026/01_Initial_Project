# WIDGET_SETTINGS_CONTRACT.md

## Contract
- Version: `1`
- Scope: lokale Widget Einstellungen
- Persistenz: lokale Datei, versioniert, migrationsfähig
- UI Style Profile Reference: `docs/WIDGET_STYLE_GUIDE.md` (v1.1)

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

## Allowed Sets
- `countries`: `USA | EZ | UK | JP | CH | CA | AU | NZ`
- `importanceLevels`: `unknown | low | medium | high`
- `datePreset`: `yesterday | today | tomorrow | this_week | next_week | custom`

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
5. `toggleBarEnabled=false` wechselt in Handle Mode mit reaktivierbarem UI-Einstieg.
6. `timezoneMode=windows` ist primär; `berlin_fallback` nur bei Resolver-Fehler.

## Runtime-only UI Toggles (nicht persistiert in v1)
- Theme Toggle (Dark/Light) ist optional, aber nicht Teil des Settings Contract v1.
- Ticker Play/Pause oder Hover-Pause sind Runtime-States und werden nicht persistiert.
- Weitere Runtime Toggles benötigen für Persistenz ein explizites Contract-Upgrade (`v2+`).

## Migration
- Jede neue Version erhält eine explizite Migrationstabelle.
- Unbekannte Versionen werden in `safe mode` normalisiert.
