# WIDGET_FEED_CONTRACT.md

## Contract
- Version: `1.1`
- Producer: `01_Initial_Project` Feed Layer
- Consumer: Windows Desktop Widget
- Transport: lokaler HTTP Feed
- Encoding: UTF-8 JSON

## Request
- Endpoint: `GET /api/widget-feed`
- Query:
  - `regions` primary
  - `countries` deprecated alias
  - `datePreset` (`yesterday|today|tomorrow|this_week|next_week|custom`)
  - `customFrom`, `customTo` bei `custom`
  - `importance` optional (`high,medium,low,unknown`)
  - `currencies` optional
  - `countriesFilter` optional

## Response Meta
- `feedVersion: string`
- `generatedAtUTC: string`
- `parserVersion: string`
- `sourceMode: "fixtures" | "live"`
- `sourcesUsed: string[]`
- `timezoneReference: "UTC"`

## Response Event
- `eventId: string`
- `datetimeUTC: string`
- `timeKind: "exact" | "all_day"`
- `region: "USA" | "EZ" | "UK" | "JP" | "CH" | "CA" | "AU" | "NZ"`
- `countryLabel: string`
- `currency: string`
- `titleRaw: string`
- `importance: "unknown" | "low" | "medium" | "high"`
- `isTopEvent: boolean`
- `actual?: string`
- `forecast?: string`
- `previous?: string`
- `source: string`
- `provenance: { fetchedAtISO: string; parserVersion: string; sourceUrlHash?: string }`

## Response Rules
1. Sortierung:
- primär `datetimeUTC`
- sekundär `importance` (`high`, `medium`, `low`, `unknown`)
- tertiär `region`
2. Top Konsistenz:
- `importance=high` und `isTopEvent=true` müssen konsistent sein.
3. Fehlende Metrics:
- Felder dürfen fehlen, Consumer rendert `n/a`.
4. No hallucination:
- Keine künstlich erzeugten Werte.
5. Past Regel:
- Vergangene Events nur bei aktivem `datePreset=yesterday`.
6. All Day:
- zulässig und als `timeKind=all_day` auszugeben.

## Error Contract
- `400` bei ungültigen Query Konflikten.
- `500` bei Feed Fehlern.
- Fehlerpayload enthält nur technische Klasse, keine sensiblen Daten.
