# IMPLEMENTATION_PLAN.md — Deterministic Macro Events App (Next.js + TypeScript)

## 1. Ziel
Implementierbarer Plan für eine deterministische Macro-Events Web-App mit:
1. Strict normiertem Wochenausblick-Text
2. Outlook-kompatiblem ICS-Export
3. Governed Multi-Source-Pipeline mit fester Priorität

Hinweis: Dieser Plan beschreibt nur Spezifikation und Umsetzungsvorgehen. Kein Code in dieser Phase.

## 2. Nicht verhandelbare Produktvorgaben
Alle Regeln in `RULES.md` sind normativ. `RULES.md` hat bei Konflikten Vorrang.

## 3. Stack
- Next.js (App Router)
- TypeScript
- API Routes für Weekly JSON und ICS
- Tests mit fixture-basierter Deterministik
- CI Gates: lint, typecheck, unit, snapshot, build

## 4. Modulgrenzen
- `src/core/*`  
  Pure functions: weekResolver, holidayEngine, normalize, classify, merge, dedupe/group, strictRenderer, icsSerializer.
- `src/server/*`  
  Source adapters, orchestration, caching, rate limiting, resilience, telemetry.
- `src/app/*`  
  UI, user interaction, state persistence, strict output display.

Keine UI-Abhängigkeiten in `core/*`.

## 5. API Contracts

## 5.1 Endpoints
1. `GET /api/weekly?regions=USA,EZ,UK,JP,CH,CA,AU,NZ`
2. `GET /api/weekly.ics?regions=USA,EZ,UK,JP,CH,CA,AU,NZ`

## 5.2 Query Contract
- Primär: `regions`.
- Deprecated Alias: `countries`.
- Konfliktfall (`regions` + `countries` widersprüchlich): `400`.

## 5.3 Weekly JSON Response
```ts
{
  renderedText: string,
  events: EconomicEvent[],
  days: RenderDay[],
  meta: {
    parserVersion: string,
    generatedAtISO: string,
    weekStartBerlinISO: string,
    weekEndBerlinISO: string
  }
}
```

## 5.4 ICS Response
- `Content-Type: text/calendar; charset=utf-8`
- `Content-Disposition: attachment; filename="Wochenausblick_YYYY-MM-DD.ics"`
- Body: RFC5545-konforme ICS-Datei (CRLF + folding)

## 6. Domain Model

## 6.1 EconomicEvent
```ts
type EconomicEvent = {
  source: "investing" | "tradingview" | `tertiary:${string}`;
  region: "USA" | "EZ" | "UK" | "JP" | "CH" | "CA" | "AU" | "NZ";
  currency: "USD" | "EUR" | "GBP" | "JPY" | "CHF" | "CAD" | "AUD" | "NZD";
  titleRaw: string;
  titleNormalized: string;
  categoryAF?: "A" | "B" | "C" | "D" | "E" | "F";
  dateBerlinISO: string; // YYYY-MM-DD
  datetimeBerlinISO: string;
  timeKind: "exact" | "all_day";
  timeHHMM?: string; // exact only
  hasExactTime: boolean;
  isTopEvent: boolean;
  importance: "low" | "medium" | "high" | "unknown";
  actual?: { value: string; source: string; asOfISO: string };
  forecast?: { value: string; source: string; asOfISO: string };
  previous?: { value: string; source: string; asOfISO: string };
  provenance: {
    fetchedAtISO: string;
    parserVersion: string;
    sourceUrlHash?: string;
  };
}
```

## 6.2 RenderDay
```ts
type RenderDay = {
  dateBerlinISO: string;
  dayHeader: string;
  lines?: string[];
  note?: string; // exakt aus erlaubtem Hinweis-Katalog
}
```

## 6.3 Region Label Mapping (render fix)
- USA -> USA
- EZ -> Euro Zone
- UK -> United Kingdom
- JP -> Japan
- CH -> Switzerland
- CA -> Canada
- AU -> Australia
- NZ -> New Zealand

## 7. Sources, Governance, Trigger

## 7.1 Priority
`Investing > TradingView > Tertiary`

## 7.2 Approved Tertiary
- Offizielle Release-Kalender/Behörden (BLS, BEA, Eurostat, ONS, Zentralbanken usw.)
- Reuters nur bei legaler lizenzierter API

## 7.3 Tertiary Trigger
Nur wenn:
1. Time conflict zwischen Investing und TradingView
2. Zeit fehlt/unklar in Primär/Sekundär, Tertiary kann exakt bestätigen
3. Primär/Sekundär down, Approved Source verfügbar

## 7.4 Non-Override
Tertiary darf Investing nie überschreiben.

## 8. Pipeline (deterministic)

## 8.1 Stage Order
1. resolveWeekBerlin
2. parseScope (regions / deprecated countries)
3. loadHolidayCalendar
4. fetchInvesting
5. fetchTradingView
6. conditionalFetchTertiary
7. normalizeToBerlin
8. filterExactTimeAndScope
9. classifyAF (`uncertain => exclude`)
10. resolveConflictsByPriority
11. dedupe
12. groupByRegionAndTime
13. markTopEvents
14. renderStrictText
15. generateICS
16. emitResponseAndTelemetry

## 8.2 Event Selection
Nur A–F-konforme Events. Unklare Fälle raus.

## 8.3 Time Filtering
Drop: tentative, missing/unklare Zeit.  
Allow:
- `exact` (HH:MM, Europe/Berlin)
- `all_day` (deterministisch als eigener Zeittyp)

## 9. Strict Rendering Contract

## 9.1 Canonical Header
`📊 WOCHENAUSBLICK [Startdatum] – [Enddatum]`

## 9.2 Canonical Day Header
`### [Wochentag], [TT]. [Monat]`

## 9.3 Canonical Event Line
`[HH:MM] Uhr: [Land/Region] [Event Titel][ - **TOP-EVENT**]`
`All Day: [Land/Region] [Event Titel][ - **TOP-EVENT**]`

## 9.4 Canonical Hinweiszeilen
- `Hinweis: Keine Handelstermine – Wochenende oder Feiertag.`
- `Hinweis: Keine Handelstermine – Feiertag.`
- `Hinweis: Keine verifizierten Events gefunden.`

## 9.5 Isolation
Strict output enthält nie Links/Quellen/Debug/Erklärung.

## 10. Holiday / Weekend / Error Logic

## 10.1 Weekend Case
Wenn Tag Wochenende-Fall ist: Tagesheader + nur Wochenend-/Feiertag-Hinweis.

## 10.2 Holiday Case
Region-spezifisch Events entfernen. Wenn Tag danach leer: Feiertag-Hinweis.

## 10.3 Verification Failure Case
Bei nicht verifizierbarer Zeit/Zeitzone oder unzuverlässigem Source-Status: verifizierte-Events-Hinweis.

## 10.4 Empty Workday Case
Wenn Werktag nach allen Filtern leer: verifizierte-Events-Hinweis.

## 11. ICS Contract (Outlook)

## 11.1 VCALENDAR
- VERSION:2.0
- CALSCALE:GREGORIAN
- METHOD:PUBLISH
- VTIMEZONE Europe/Berlin (pflichtig)

## 11.2 VEVENT Pflichtfelder
- UID (deterministisch)
- DTSTAMP (deterministisch)
- DTSTART/DTEND (timed: `TZID=Europe/Berlin`, all-day: `VALUE=DATE`)
- SUMMARY
- DESCRIPTION mit deterministischen Metrics-Linien (`Importance`, `Actual`, `Forecast`, `Previous`)
- CATEGORIES:Wirtschafts-Event (pflichtig in jedem VEVENT)

## 11.3 Deterministic DTSTAMP
`DTSTAMP = UTC(weekStartBerlin 00:00)`  
Nicht aus Laufzeit ableiten.

## 11.4 UID
Hash aus `weekStart + region + datetime + titleNormalized + parserVersion`.

## 11.5 Serialization
CRLF, line folding, stabile property order.

## 11.6 All-Day Semantics
- `DTSTART;VALUE=DATE:YYYYMMDD`
- `DTEND;VALUE=DATE:YYYYMMDD` (Folgetag, exclusive end)

## 12. UI Flow (Schritt 1–3)

## 12.1 Schritt 1: Scope wählen
- Checkbox Grid (8 Regionen)
- Buttons: „Alle“ / „Keine“
- Persistenz: URL Query + localStorage

## 12.2 Schritt 2: Wochenausblick generieren
- Trigger auf `/api/weekly`
- Economic-Calendar-Tabelle anzeigen:
  `Date + Time | Currency | Event | Importance | Actual | Forecast | Previous`
- Weekday-Gruppierung pro Tag beibehalten
- Strict output in `<pre>` zusätzlich anzeigen (copyable, canonical)
- Optional UI-Badges außerhalb strict block

## 12.3 Schritt 3: ICS herunterladen
- Trigger auf `/api/weekly.ics`
- Standard browser download
- Optional Wunschverzeichnis via File System Access API (Chromium), Fallback download

## 13. Robustness / Fetching
- Default: serverseitiges HTTP Fetch + Parser
- Optional Playwright-Fallback hinter Feature-Flag (`PLAYWRIGHT_ENABLED`)
- CI ohne Live-Netz, nur Fixtures

## 13.1 Build vs Runtime Network Requirements
- Build/Dependency path:
  - Benötigt Zugriff auf npm registry (`registry.npmjs.org` oder Mirror), um `npm ci` auszuführen.
  - Erfolgt bevorzugt in CI/Docker Build Stage.
  - CI ist Source of Truth für Build/Checks, falls lokaler Runner keinen Registry-Zugriff hat.
- Runtime/Data path:
  - Benötigt Zugriff auf Datenquellen (Investing, TradingView, optional approved tertiary, Reuters nur mit Lizenz/API-Key).
  - Runtime darf keinen `npm install` benötigen.
- Deploymentziel:
  - Multi-stage Docker Build erzeugt ein lauffähiges Standalone Runtime-Image.
  - Runtime-Container startet ohne Build-Dependency-Network.

## 14. Tests (Pflichtmatrix)

## 14.1 Determinism
- gleiche Fixtures => byte-identischer strict text
- gleiche Fixtures => byte-identische ICS-Datei

## 14.2 WeekResolver
- Mo–Fr laufende Woche
- Sa/So nächste Woche
- DST Europe/Berlin

## 14.3 Parser/Adapter
- Fixtures pro Source
- DOM-Varianten
- missing/invalid time

## 14.4 Classification
- A–F positive Fälle
- uncertain => exclude
- false positives rejected

## 14.5 Merge/Dedupe/Grouping
- source conflict resolution
- same region + same time -> one line with ` / `
- chronological per day

## 14.6 Rendering
- canonical header/day/event lines exact
- canonical all-day line exact: `All Day: ...`
- TOP suffix exact: ` - **TOP-EVENT**`
- exact note lines

## 14.7 ICS
- every VEVENT has `CATEGORIES:Wirtschafts-Event`
- every VEVENT has `DESCRIPTION` metrics lines
- deterministic DTSTAMP
- VTIMEZONE present
- CRLF + folding validation
- all-day VALUE=DATE validation

## 14.8 API Contract
- `regions` primary
- `countries` deprecated alias
- mismatch conflict -> 400

## 15. CI Gates
- lint
- typecheck
- unit
- snapshot
- build

Snapshot updates nur via explizitem Maintainer-Flow.

## 16. Deliverables (Planphase)
1. Final `RULES.md` (normativ)
2. Final `IMPLEMENTATION_PLAN.md` (dieses Dokument)
3. Optional `ARCHITECTURE.md` textbasiert
4. Ready-for-GO Checklist

## 17. Vorschlag Dateibaum (für GO-Phase)
- `src/app/page.tsx`
- `src/app/api/weekly/route.ts`
- `src/app/api/weekly.ics/route.ts`
- `src/core/weekResolver.ts`
- `src/core/holidayEngine.ts`
- `src/core/normalize.ts`
- `src/core/classifier.ts`
- `src/core/merge.ts`
- `src/core/dedupeGroup.ts`
- `src/core/rendererStrictDe.ts`
- `src/core/icsSerializer.ts`
- `src/server/sources/investing.ts`
- `src/server/sources/tradingview.ts`
- `src/server/sources/tertiary/*.ts`
- `src/server/orchestrator.ts`
- `tests/fixtures/*`
- `tests/*.test.ts`
