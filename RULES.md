# RULES.md — Normative Product Rules (Deterministic Macro Events App)

## R-01 Scope
Diese Regeln sind verbindlich für UI, API, Core-Pipeline, Rendering, ICS-Export, Tests und CI.

## R-02 Determinismus (global)
Gleiche Inputs + gleiche Fixtures + gleiche parserVersion => identischer Output:
1. identischer Strict-Text (byte-identisch)
2. identische ICS-Datei (byte-identisch)

## R-03 Week Logic (Europe/Berlin)
1. Wenn aktueller Tag in Europe/Berlin Mo–Fr ist: nutze laufende Woche (Mo–Fr).
2. Wenn aktueller Tag in Europe/Berlin Sa/So ist: nutze kommende Woche (Mo–Fr).
3. Alle ausgegebenen Zeiten sind Europe/Berlin.

## R-04 Country Scope (erlaubte Regionen)
Erlaubte Regionen und Währungen:
- USA (USD)
- EZ / Euro Zone (EUR)
- UK / United Kingdom (GBP)
- JP / Japan (JPY)
- CH / Switzerland (CHF)
- CA / Canada (CAD)
- AU / Australia (AUD)
- NZ / New Zealand (NZD)

## R-05 API Query Contract
1. Primärer Query-Parameter: `regions=USA,EZ,UK,JP,CH,CA,AU,NZ`.
2. `countries=...` ist nur deprecated Alias.
3. Wenn `regions` und `countries` gleichzeitig gesetzt sind und unterschiedlich normalisieren: `400 Bad Request`.
4. UI persistiert Scope in URL Query und localStorage.

## R-06 Sources & Priority
1. Primär: Investing.com Economic Calendar.
2. Sekundär: TradingView Economic Calendar.
3. Tertiär: nur Approved Sources.
4. Konfliktpriorität ist strikt: `Investing > TradingView > Tertiary`.

## R-07 Tertiary Trigger Rules (pflichtig)
Tertiary darf nur laufen, wenn mindestens eine Bedingung erfüllt ist:
1. Investing und TradingView liefern widersprüchliche Uhrzeiten.
2. Event ist in Primär/Sekundär vorhanden, aber Zeit fehlt/unklar und Tertiary kann exakt bestätigen.
3. Primär/Sekundär sind nicht erreichbar und eine Approved Source ist verfügbar.

## R-08 Tertiary Override-Verbot
1. Tertiary darf Investing nie überschreiben.
2. Reuters ist ohne legalen API-Key/Lizenz deaktiviert.

## R-09 Region Render Labels (fix)
Exaktes Mapping für Strict Output:
- `USA => "USA"`
- `EZ  => "Euro Zone"`
- `UK  => "United Kingdom"`
- `JP  => "Japan"`
- `CH  => "Switzerland"`
- `CA  => "Canada"`
- `AU  => "Australia"`
- `NZ  => "New Zealand"`

## R-10 Eventkategorien A–F (normativ)
Nur klar passende Events:
- A Zentralbank: Rate/Leitzins/Statement/Minutes/Pressekonferenz/Reden/Projektionen/Dot Plot/QE/QT
- B Inflation: CPI/VPI/Core CPI/PPI/PCE Price Index
- C Arbeitsmarkt: NFP/Arbeitslosenquote/Löhne(Job Earnings)/Jobless Claims/JOLTS/ADP
- D Konjunktur: GDP/BIP/Industrieproduktion/Auftragseingänge/ISM/PMI
- E Konsum: Retail Sales/Personal Spending/Personal Income/Consumer Confidence/Sentiment
- F Immobilien (nur hochrelevant): Housing Starts/Building Permits

## R-11 Classification Safety
`uncertain => exclude` ist harte Regel.
Kein LLM-Guessing im Core.

## R-12 TOP-EVENT
TOP, wenn:
- Zentralbanktermin (Rate/Statement/Minutes/PressConf/Speech/Projections/QE/QT), oder
- CPI/PCE, oder
- NFP, oder
- GDP/BIP, oder
- PMI/ISM

Suffix am Zeilenende exakt:
` - **TOP-EVENT**`
(inklusive führendem Leerzeichen vor `-`)

## R-13 Day-Level Fallback Logic (strict)
Pro Tag gilt genau eine der Regeln:
1. Wochenende-Fall:  
   `Hinweis: Keine Handelstermine – Wochenende oder Feiertag.`
2. Feiertags-Fall (nach region-spezifischem Entfernen, Tag leer):  
   `Hinweis: Keine Handelstermine – Feiertag.`
3. Quellen-/Verifikationsfehler oder normaler Werktag ohne valide Events:  
   `Hinweis: Keine verifizierten Events gefunden.`

## R-14 Zeitregeln
1. Nur exakte Uhrzeit zulässig.
2. Exkludiere `All Day`, `Tentative`, fehlende Zeit.
3. Ausgabezeitformat: `HH:MM Uhr` (24h, Europe/Berlin).

## R-15 Sortierung / Grouping / Dedupe
1. Pro Tag chronologisch sortieren.
2. Gleiches Land + gleiche Uhrzeit => eine Zeile.
3. Titel in dieser Zeile mit ` / ` trennen.
4. Dedupe über Quellen hinweg ist verpflichtend.

## R-16 Strict Output Isolation
Der Strict-Output-Block enthält ausschließlich finale Liste im Canonical Format.
Verboten im Strict-Output: Links, Quellenangaben, Debug, Zusatzprosa.

## R-17 ICS Pflichtprofil (Outlook-kompatibel)
1. Endpoint liefert `text/calendar; charset=utf-8` + `Content-Disposition: attachment`.
2. RFC5545-konform mit CRLF und Line Folding.
3. `VTIMEZONE` für Europe/Berlin ist Pflicht.
4. `DTSTART/DTEND` mit `TZID=Europe/Berlin`.
5. UID deterministisch aus:
   `weekStart + region + datetime + titleNormalized + parserVersion`
6. `DTSTAMP` deterministisch aus:
   `weekStartBerlin 00:00 -> UTC`.
7. Jeder VEVENT enthält exakt:
   `CATEGORIES:Wirtschafts-Event`
   (nicht optional, nicht test-only).

## R-18 Canonical Strict Output Format
Exakte Struktur:

📊 WOCHENAUSBLICK [Startdatum] – [Enddatum] [Monat] [Jahr]
### [Wochentag], [TT]. [Monat]
[HH:MM] Uhr: [Land/Region] [Event Titel][ - **TOP-EVENT**]

Formatregeln:
- Startdatum/Enddatum: `DD.MM.YYYY`
- Monat/Wochentag: deutsch ausgeschrieben
- Mo–Fr Tagesheader immer vorhanden

## R-19 Sprint Cadence (execution default)
1. Standard-Sprintdauer ist `1 Woche` (Mo–Fr) für schnelle Inspect/Adapt-Zyklen.
2. Jeder Sprint hat genau diese Phasen mit Timebox:
   - Planning + Backlog Refinement: max. `60 Minuten`
   - Daily Execution Sync: max. `15 Minuten` je Arbeitstag
   - Sprint Review: max. `45 Minuten`
   - Retrospective: max. `45 Minuten`
3. Ein neuer Sprint startet direkt nach Abschluss des vorherigen Sprints.

## R-20 Definition of Ready (DoR, verpflichtend)
Ein Arbeitspaket darf nur in einen Sprint, wenn alle Punkte erfüllt sind:
1. Scope ist auf konkrete Dateien/Module begrenzt.
2. Betroffene Produktregeln (`R-*`) sind explizit referenziert.
3. Akzeptanzkriterien sind testbar formuliert (mindestens ein konkreter Testfall).
4. Security-Impact ist klassifiziert (`none`, `low`, `high`).
5. Rollback-Strategie ist benannt (Revert/Hotfix-Pfad).

## R-21 Definition of Done (DoD, verpflichtend)
Ein Arbeitspaket ist nur fertig, wenn alle Punkte erfüllt sind:
1. Targeted Tests für den geänderten Bereich sind grün.
2. Vollständige Determinism-Gates sind grün (`verify:release` in Node `>=20.9.0` Umgebung).
3. Release-Gate-Marker ist für den aktuellen Stand valide (`HEAD` oder Marker-Commit unmittelbar danach).
4. Doku/Evidence sind aktualisiert (mindestens Status + betroffene Tests/Fixes).
5. Kein ungeklärter Workspace-Drift verbleibt.

## R-22 Security Mitigation Gates
1. Keine Secrets/Tokens/Credentials im Repository.
2. Jede Dependency-Änderung braucht:
   - begründete Notiz im Commit/PR und
   - verifizierten CI-Lauf mit allen Gates.
3. Neue externe Datenquelle/Endpoint nur mit ToS-/Lizenzprüfung und dokumentierter Governance.
4. Security-relevante Findings mit hoher Kritikalität blockieren Release bis Fix oder dokumentierter, befristeter Ausnahme.

## R-23 Quality & Cycle-Efficiency Mitigations
1. WIP-Limit: pro Entwickler gleichzeitig maximal `1` aktives Feature-Slice.
2. Slice-Limit: ein Slice sollte in `<= 1 Arbeitstag` integrierbar sein; sonst Split verpflichtend.
3. Maximal `2` reine Planning-Zyklen hintereinander ohne Code-/Test-Delta; danach Execution verpflichtend.
4. Jede Retrospektive erzeugt mindestens:
   - eine Automatisierungsmaßnahme gegen den größten Reibungsverlust und
   - einen messbaren Quality-Gate-Check für den nächsten Sprint.
