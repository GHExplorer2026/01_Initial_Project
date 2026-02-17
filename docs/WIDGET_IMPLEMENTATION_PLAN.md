# WIDGET_IMPLEMENTATION_PLAN.md

## 1. Zielbild
- Neues Windows Desktop Widget Projekt als UI Layer, getrennt vom Web Frontend.
- Bestehendes `01_Initial_Project` bleibt Feed Provider und Source Governance Layer.
- Widget zeigt Economic Events als laufenden Ticker mit Settings-basierten Filtern.
- Kein direkter Source Fetch im Widget.
- UI-Verhaltensprofil folgt `docs/WIDGET_STYLE_GUIDE.md` v1.1, sofern nicht im Konflikt mit Feed/Settings Contract.

## 2. Nicht Ziele
- Kein zweiter Scraping Stack im Widget.
- Kein Ersatz der bestehenden Web App.
- Keine Änderung der Source Priority Regeln im bestehenden Feed Layer.

## 3. Architekturentscheidung

### Option A
- Feature Extension in bestehender Web App.
- Ergebnis: abgelehnt.
- Grund: Desktop Runtime Verhalten und Web Runtime sauber trennen.

### Option B
- Vollständig neues Projekt inklusive Datenlogik.
- Ergebnis: abgelehnt.
- Grund: doppelter Governance Stack und höheres Compliance Risiko.

### Option C (gewählt)
- Neues Desktop UI Projekt als Feed Consumer.
- Bestehendes Projekt liefert versionierten Feed.
- Vorteil: maximale Wiederverwendung mit sauberer Trennung.

## 4. Scope

### Muss
- Neues Desktop UI Projekt als Widget.
- Feed Nutzung via lokalem HTTP Feed Vertrag.
- Settings Filter:
  - Date (`Yesterday`, `Today`, `Tomorrow`, `This Week`, `Next Week`, `Custom Dates`)
  - Country
  - Currency
  - Importance
  - Toggle Bar
- Ticker Anzeige je Event mit `Actual`, `Forecast`, `Previous`.
- Vergangene Events ausblenden, außer `Yesterday` ist aktiv.
- All Day Events zulassen.
- Top Events (`importance=high` oder 3 Sterne) visuell fett anzeigen.
- UTC intern, lokale Anzeige via Windows Zeitzone, DST validieren.
- DatePreset/Filter-Mapping exakt gemäß `WIDGET_SETTINGS_CONTRACT.md` und `WIDGET_FEED_CONTRACT.md`.
- `regions` als Primary Query Parameter, kein `countries` aus dem Widget senden.

### Soll
- Last Good Feed Cache.
- Polling Backoff bei Fehlern.
- Statusanzeige für Feed Qualität.

### Kann
- Hotkey für Ein Ausblenden.
- Multi Monitor Position Restore.
- Ticker Dichte Profil.

## 5. Feed Vertrag
- Siehe `docs/WIDGET_FEED_CONTRACT.md`.
- Feed Version: `1.1`.
- Der Vertrag ist zwischen Feed Provider und Desktop Widget verbindlich.

## 6. Settings Vertrag
- Siehe `docs/WIDGET_SETTINGS_CONTRACT.md`.
- Settings Version: `1`.
- Persistenz lokal, versioniert, migrationsfähig.
- Runtime-only Toggles (Theme, Play/Pause, Hover-Pause) sind nicht persistiert in v1.

## 7. Ticker Darstellungsvertrag
1. Pro Event anzeigen:
   - lokale Zeit
   - Country oder Region
   - Event Titel
   - Actual
   - Forecast
   - Previous
2. All Day Events mit `All Day` Label.
3. Top Events visuell fett.
4. Fehlende Werte als `n/a`.
5. Keine Schätzung oder inferierte Werte.
6. Lane nutzt `region` als kompaktes Label; `countryLabel` nur in Tooltip/Detail.

## 7.1 UI Komponentenprofil (Style Guide v1.1, übernommen)
- `Widget Bar`: schmale Leiste, drag-fähig auf nicht-klickbaren Flächen.
- `Ticker Lane`: kontinuierlicher Lauftext in Feed-Reihenfolge.
- `Control Cluster`: mindestens Settings Control; optional Play/Pause.
- `Settings Panel`: einzige Stelle für persistierte Settings.
- `Handle Mode`: bei `toggleBarEnabled=false` bleibt ein reaktivierbarer Einstieg sichtbar.

## 7.2 UI Status- und Interaktionsregeln (übernommen)
- `Loading`: dezenter Indikator, keine blockierende Dialoglogik.
- `Empty`: klare User-Message, z. B. "Keine Events im aktuellen Filter".
- `Error`: kurze Message "Feed nicht erreichbar"; keine sensiblen Details.
- `Hover`: Pause ist empfohlen.
- `Keyboard Minimum`: Tab, Enter, Esc.
- `A11y`: Bedeutung nie nur über Farbe, Kontrast auch bei Transparenz-Default lesbar.

## 8. Date Filter Semantik
1. Default: `Today`.
2. Ohne `Yesterday` keine Events mit `event.datetimeUTC < nowUTC`.
3. Mit `Yesterday` sind vergangene Events vom Vortag zulässig.
4. `Custom Dates` ist vorwärtsgerichtet ab `nowUTC`, mit derselben Yesterday Ausnahme.

## 9. Schnittstellenaufteilung
- Feed Layer (bestehendes Projekt):
  - Source Fetch, Normalize, Merge, Governance, Contract Ausgabe.
- Widget Layer (neues Projekt):
  - UI, Fensterverhalten, Settings, lokale Darstellung, Ticker.
- Gemeinsame Kontrakte:
  - Feed v1.1
  - Settings v1

## 10. Schritte, getrennte Vorgehensweise
1. Contract + Style Freeze (`WIDGET_FEED_CONTRACT.md`, `WIDGET_SETTINGS_CONTRACT.md`, `WIDGET_STYLE_GUIDE.md`).
2. Neues Desktop Repo oder klarer Monorepo Bereich für Widget UI.
3. Feed Provider um Widget Feed Endpoint erweitern.
4. Date Filter und Vergangenheitsregel im Feed deterministisch umsetzen.
5. Widget Shell (movable, optional always on top, transparency, handle mode).
6. Ticker Renderer mit Top Bold, Metrics und Feed-Reihenfolge.
7. Settings Persistenz und Migration.
8. Fehlerpfade plus Last Good Cache.
9. Contract, Unit, Integration, UI E2E, DST Tests.
10. RC Gate mit Security, Compliance, Rollback.

## 11. Gates

### Gate 0
- Exit: Scope, Annahmen, Option C freigegeben.
- Artefakt: dieses Dokument.

### Gate 1
- Exit: Feed und Settings Verträge final.
- Artefakte: Contract Docs.
- Checks: Schema und Contract Tests grün.

### Gate 2
- Exit: Vertical Slice zeigt Ticker aus Fixture Feed.
- Artefakte: Demo Nachweis und Testreport.

### Gate 3
- Exit: Muss Features komplett.
- Checks: Date Filter, Past Regel, All Day, Top Bold.

### Gate 4
- Exit: Security und Compliance freigegeben.
- Checks: Secrets, Logs, Source Governance.

### Gate 5
- Exit: RC freigegeben.
- Checks: vollständige Testmatrix, Rollback Nachweis.

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
- Contract Tests für Feed und Settings.
- Unit Tests für Filter, Zeitregeln, Top Mapping.
- Integration Tests Feed Consumer.
- UI E2E für Widget Verhalten.
- DST Tests für Berlin und Windows lokale Zeitzone.

## 14. Annahmen
1. Distribution außerhalb Store.
2. Feed lokal erreichbar.
3. Polling initial statt Streaming.
4. Custom Dates folgt der obigen Past Regel.
