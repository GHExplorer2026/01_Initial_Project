# WIDGET_SETTINGS_CONTRACT.md

## Contract
- Version: `3`
- Scope: lokale Widget Einstellungen (Native Runtime)
- Persistenz: lokale Datei, versioniert, migrationsfaehig
- UI Style Profile Reference: `docs/WIDGET_STYLE_GUIDE.md` (v1.2)

## Required Fields
- `providerMode: "local_bundled" | "remote"`
- `providerBaseUrl: string`
- `providerPort: number` (1..65535)
- `providerStartupTimeoutSec: number` (10..180)
- `providerRetryIntervalSec: number` (5..120)
- `datePreset: "yesterday" | "today" | "tomorrow" | "this_week" | "next_week" | "custom"`
- `customFrom?: string`
- `customTo?: string`
- `regions: string[]`
- `importanceLevels: Array<"unknown" | "low" | "medium" | "high">`
- `alwaysOnTop: boolean`
- `autoStartWindows: boolean`
- `transparency: number` (35..100)
- `fontSizePx: number` (14..40)
- `refreshSeconds: number` (15..300)
- `tickerSpeedLevel: 1 | 2 | 3`

## Allowed Sets
- `regions`: `USA | EZ | UK | JP | CH | CA | AU | NZ`
- `importanceLevels`: `unknown | low | medium | high`
- `datePreset`: `yesterday | today | tomorrow | this_week | next_week | custom`

## Defaults
- `providerMode`: `local_bundled`
- `providerBaseUrl`: `http://127.0.0.1:3000`
- `providerPort`: `3000`
- `providerStartupTimeoutSec`: `45`
- `providerRetryIntervalSec`: `10`
- `datePreset`: `today`
- `regions`: `USA,EZ`
- `importanceLevels`: alle
- `alwaysOnTop`: `false`
- `autoStartWindows`: `false`
- `transparency`: `100`
- `fontSizePx`: `22`
- `refreshSeconds`: `45`
- `tickerSpeedLevel`: `1`

## Rules
1. Wenn `datePreset != custom`, dann `customFrom/customTo` ignorieren.
2. Wenn `datePreset=custom`, muessen beide Felder valide sein.
3. Mindestens eine Region muss aktiv sein.
4. Vergangenheit ohne `yesterday` nicht anzeigen.
5. Ungueltige Felder werden auf Default normalisiert.
6. Zeitzone wird aus Windows System aufgeloest, mit Berlin Fallback, nicht als persistiertes Settings-Feld.
7. Bei `providerMode=local_bundled` startet das Widget den lokalen Provider automatisch und prueft Health ueber `/api/healthz`.
8. Bei `providerMode=remote` findet kein lokaler Provider-Spawn statt.

## Removed In v2
- `currencies`
- `toggleBarEnabled`
- `tickerSpeed`
- `timezoneMode`

## Migration v1 -> v2
1. `countries` wird auf `regions` gemappt.
2. Entfallene Felder (`currencies`, `toggleBarEnabled`, `tickerSpeed`, `timezoneMode`) werden verworfen.
3. Fehlende neue Felder werden auf v2 Defaults gesetzt.

## Migration v2 -> v3
1. `baseUrl` wird auf `providerBaseUrl` gemappt.
2. Fehlendes `providerMode` wird auf `local_bundled` gesetzt.
3. Fehlende Provider-Runtime-Felder werden auf v3 Defaults gesetzt.
4. `autoStartWindows` wird default `false`.

## Persisted Envelope
```json
{
  "version": 2,
  "settings": { "...": "..." }
}
```

Rules:
1. Legacy payload ohne Envelope wird weiterhin akzeptiert und nach v3 normalisiert.
2. Ungueltige oder fehlende Felder werden auf Contract-Defaults zurueckgesetzt.
3. `customFrom/customTo` werden nur bei `datePreset=custom` persistiert.
