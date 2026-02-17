# WIDGET_IMPLEMENTATION_PLAN.md

## 1. Zielbild
- Neues Windows Desktop Widget Projekt als UI Layer, getrennt vom Web Frontend.
- Bestehendes `01_Initial_Project` bleibt Feed Provider und Source Governance Layer.
- Widget zeigt Economic Events als laufenden Ticker mit Settings-basierten Filtern.
- Kein direkter Source Fetch im Widget.
- UI-Verhaltensprofil folgt `docs/WIDGET_STYLE_GUIDE.md` v1.2.

## 2. Nicht Ziele
- Kein zweiter Scraping Stack im Widget.
- Kein Ersatz der bestehenden Web App.
- Keine Aenderung der Source Priority Regeln im Feed Layer.

## 3. Architekturentscheidung
### Option A
- Feature Extension in bestehender Web App.
- Ergebnis: abgelehnt.

### Option B
- Vollstaendig neues Projekt inklusive Datenlogik.
- Ergebnis: abgelehnt.

### Option C (gewaehlt)
- Neues Desktop UI Projekt als Feed Consumer.
- Bestehendes Projekt liefert versionierten Feed.

## 4. Scope
### Muss
- Neues Desktop UI Projekt als Widget.
- Feed Nutzung via lokalem HTTP Feed Vertrag.
- Settings Filter:
  - Date (`Yesterday`, `Today`, `Tomorrow`, `This Week`, `Next Week`, `Custom Dates`)
  - Regions
  - Importance
- Alle Settings im separaten Fenster via Zahnrad.
- Ticker Anzeige je Event mit `Date + Time`, `Actual`, `Forecast`, `Previous`.
- Vergangene Events ausblenden, ausser `Yesterday` ist aktiv.
- All Day Events zulassen.
- Top Events visuell fett anzeigen.
- Schriftgroesse konfigurierbar, Widget-Groesse dynamisch aus Settings.
- UTC intern, lokale Anzeige via Windows Zeitzone, DST validieren.
- `regions` als Primary Query Parameter, kein `countries` aus dem Widget senden.

### Soll
- Last Good Feed Cache.
- Polling Backoff bei Fehlern.
- Statusanzeige fuer Feed Qualitaet.

### Kann
- Hotkey fuer Ein/Ausblenden.
- Multi Monitor Position Restore.

## 5. Feed Vertrag
- Siehe `docs/WIDGET_FEED_CONTRACT.md`.
- Feed Version: `1.1`.

## 6. Settings Vertrag
- Siehe `docs/WIDGET_SETTINGS_CONTRACT.md`.
- Settings Version: `2`.
- Persistenz lokal, versioniert, migrationsfaehig.

## 7. Ticker Darstellungsvertrag
1. Pro Event anzeigen:
   - lokale `Date + Time` oder `All Day`
   - Region
   - Event Titel
   - Actual / Forecast / Previous
2. All Day Events mit `All Day` Label.
3. Top Events visuell fett.
4. Fehlende Werte als `n/a`.
5. Keine Schätzung oder inferierte Werte.

## 8. Date Filter Semantik
1. Default: `Today`.
2. Ohne `Yesterday` keine Events mit `event.datetimeUTC < nowUTC`.
3. Mit `Yesterday` sind vergangene Events vom Vortag zulaessig.
4. `Custom Dates` ist vorwaertsgerichtet ab `nowUTC`, mit derselben Yesterday-Ausnahme.

## 9. Schnittstellenaufteilung
- Feed Layer (bestehendes Projekt):
  - Source Fetch, Normalize, Merge, Governance, Contract Ausgabe.
- Widget Layer (neues Projekt):
  - UI, Fensterverhalten, Settings, lokale Darstellung, Ticker.

## 10. Schritte
1. Contract + Style Freeze.
2. Neues Desktop Repo fuer Widget UI.
3. Feed Provider um Widget Feed Endpoint erweitern.
4. Date Filter und Vergangenheitsregel im Feed deterministisch umsetzen.
5. Widget Shell (movable, optional always on top, transparency).
6. Ticker Renderer mit Top Bold, Date+Time und Metrics.
7. Settings Persistenz und Migration.
8. Fehlerpfade plus Last Good Cache.
9. Contract, Unit, Integration, UI E2E, DST Tests.
10. RC Gate mit Security, Compliance, Rollback.

## 11. Gates
### Gate 0
- Exit: Scope, Annahmen, Option C freigegeben.

### Gate 1
- Exit: Feed und Settings Vertraege final.

### Gate 2
- Exit: Vertical Slice zeigt Ticker aus Fixture Feed.

### Gate 3
- Exit: Muss Features komplett.

### Gate 4
- Exit: Security und Compliance freigegeben.

### Gate 5
- Exit: RC freigegeben.

## 12. Risiken und Mitigation
1. Fragiles Scraping.
- Mitigation: Scraping nur im Feed Layer.
2. ToS und Lizenzkonflikte.
- Mitigation: approved sources only.
3. DST Fehler.
- Mitigation: UTC intern plus DST Matrix.
4. Filter Inkonsistenz.
- Mitigation: ein gemeinsamer Contract.
5. UI Performance.
- Mitigation: Render Queue Limits.
6. Polling Drift.
- Mitigation: deterministische Intervalle plus Backoff.
7. Secret Leak.
- Mitigation: Env oder OS Secret Store.
8. Sensitive Logging.
- Mitigation: strukturierte, reduzierte Logs.
9. Offline Verhalten.
- Mitigation: Last Good Cache plus Status.
10. Rollback Risiko.
- Mitigation: versionierter Rollback Drill.

## 13. Validierung
- Contract Tests fuer Feed und Settings.
- Unit Tests fuer Filter, Zeitregeln, Top Mapping.
- Integration Tests Feed Consumer.
- UI E2E fuer Widget Verhalten.
- DST Tests fuer Berlin und Windows lokale Zeitzone.

## 14. Annahmen
1. Distribution ausserhalb Store.
2. Feed lokal erreichbar.
3. Polling initial statt Streaming.
4. Custom Dates folgt der obigen Past Regel.
