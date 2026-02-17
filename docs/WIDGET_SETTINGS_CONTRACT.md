# WIDGET_SETTINGS_CONTRACT.md

## Contract
- Version: `2`
- Scope: lokale Widget Einstellungen (Native Runtime)
- Persistenz: lokale Datei, versioniert, migrationsfaehig
- UI Style Profile Reference: `docs/WIDGET_STYLE_GUIDE.md` (v1.2)

## Required Fields
- `baseUrl: string`
- `datePreset: "yesterday" | "today" | "tomorrow" | "this_week" | "next_week" | "custom"`
- `customFrom?: string`
- `customTo?: string`
- `regions: string[]`
- `importanceLevels: Array<"unknown" | "low" | "medium" | "high">`
- `alwaysOnTop: boolean`
- `transparency: number` (35..100)
- `fontSizePx: number` (14..40)
- `refreshSeconds: number` (15..300)

## Allowed Sets
- `regions`: `USA | EZ | UK | JP | CH | CA | AU | NZ`
- `importanceLevels`: `unknown | low | medium | high`
- `datePreset`: `yesterday | today | tomorrow | this_week | next_week | custom`

## Defaults
- `baseUrl`: `http://127.0.0.1:3000`
- `datePreset`: `today`
- `regions`: `USA,EZ`
- `importanceLevels`: alle
- `alwaysOnTop`: `false`
- `transparency`: `100`
- `fontSizePx`: `22`
- `refreshSeconds`: `45`

## Rules
1. Wenn `datePreset != custom`, dann `customFrom/customTo` ignorieren.
2. Wenn `datePreset=custom`, muessen beide Felder valide sein.
3. Mindestens eine Region muss aktiv sein.
4. Vergangenheit ohne `yesterday` nicht anzeigen.
5. Ungueltige Felder werden auf Default normalisiert.
6. Zeitzone wird aus Windows System aufgeloest, mit Berlin Fallback, nicht als persistiertes Settings-Feld.

## Removed In v2
- `currencies`
- `toggleBarEnabled`
- `tickerSpeed`
- `timezoneMode`

## Migration v1 -> v2
1. `countries` wird auf `regions` gemappt.
2. Entfallene Felder (`currencies`, `toggleBarEnabled`, `tickerSpeed`, `timezoneMode`) werden verworfen.
3. Fehlende neue Felder werden auf v2 Defaults gesetzt.

## Persisted Envelope
```json
{
  "version": 2,
  "settings": { "...": "..." }
}
```

Rules:
1. Legacy payload ohne Envelope wird weiterhin akzeptiert und nach v2 normalisiert.
2. Ungueltige oder fehlende Felder werden auf Contract-Defaults zurueckgesetzt.
3. `customFrom/customTo` werden nur bei `datePreset=custom` persistiert.
