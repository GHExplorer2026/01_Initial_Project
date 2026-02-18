# WIDGET_CROSS_REPO_DELIVERY_REPORT.md

## 1. Zweck und Scope
Dieses Dokument konsolidiert die Entwicklung des Widget-Produkts ueber beide Repos:
1. Feed Provider: `01_Initial_Project`
2. Native Runtime: `02_Widget_Native_Runtime`

Es dokumentiert Architektur, gelieferte Modifikationen, Contract-Status, Gate-Status, kritische Fixes und den aktuellen Betriebsstand.

## 2. Repo-Rollen
### 2.1 `01_Initial_Project` (Provider)
- Source Governance und Orchestrierung.
- Endpoint fuer Widget-Consumer: `GET /api/widget-feed`.
- Deterministische Datenregeln, Prioritaeten, Filtersemantik, no-hallucination.

### 2.2 `02_Widget_Native_Runtime` (Native UI)
- Desktop Widget UI (Ticker) als Feed-Consumer.
- Fenster-/UX-Verhalten, Settings-Fenster, lokale Darstellung.
- Kein direkter Source Fetch.

## 3. Lieferumfang nach Phasen
### 3.1 Provider-seitig (W-1109 bis W-1119)
- Widget Feed Contract eingefuehrt (`docs/WIDGET_FEED_CONTRACT.md`, v1.1).
- Runtime/Release Gates und Evidence-Paket aufgebaut.
- SOURCE_MODE Trennung (`fixtures`/`live`) stabilisiert.
- Live-Provider-Bug fuer Week-Presets gefixt:
  - Commit `316d931`: `this_week`/`next_week` 500 entfernt.

### 3.2 Native-seitig (W-1120 bis W-1129)
- Eigenes Repo aufgesetzt und auf GitHub gepusht.
- Gate-System W-112x inkl. Evidence aufgebaut.
- Vertical Slice Shell + Feed Consumer + Filter + DST Hardening umgesetzt.
- W-1129 RC Gate abgeschlossen (PASS, GO).
- Danach UI-Redesign und Produktionsfixes:
  - `34788a6`: Ticker-only UI + separates Settings-Fenster.
  - `f322264`: stabile 3-Stufen-Schnell/langsam Logik eingefuehrt.
  - `d668c20`: Default Speed auf Stufe 1.
  - `28100ef`: Regions/Importance Toggle-Fix + sichtbares Refresh-Verhalten + Speed-Wirkung verbessert.

## 4. Aktueller Funktionsstand (Ist)
### 4.1 Ticker UI
- Kompakte Hauptleiste mit Laufschrift.
- Datum+Zeit pro Event in der Lane.
- All-Day Events als `All Day`.
- Top-Events fett.

### 4.2 Settings
- Separate Einstellungen via Zahnrad.
- Filter: Date Preset, Regions, Importance.
- Visual/Runtime: Schriftgroesse, Transparenz, Always-on-top.
- Polling: `Feed Refresh Intervall (Sek.)`.
- Speed: `Ticker Speed Level` Stufe 1/2/3.

### 4.3 Entfernt/abgeloest
- Currency-Filter im Widget entfernt.
- Toggle-Bar/Handle-Mode im aktuellen UI-Modell nicht mehr verwendet.

## 5. Vertragsstand (Normativ)
### 5.1 Feed
- `docs/WIDGET_FEED_CONTRACT.md`: v1.1
- Primary Scope Query: `regions`

### 5.2 Settings
- `docs/WIDGET_SETTINGS_CONTRACT.md`: v2
- Persistierte Felder: `baseUrl`, `datePreset`, `customFrom/customTo`, `regions`, `importanceLevels`, `alwaysOnTop`, `transparency`, `fontSizePx`, `refreshSeconds`.
- Neu in v2: `tickerSpeedLevel` als Widget-Laufgeschwindigkeit.

### 5.3 Style
- `docs/WIDGET_STYLE_GUIDE.md`: v1.2
- Ticker-only + Settings-Fenster Modell verbindlich beschrieben.

## 6. Kritische Bugs und deren Fix
1. Provider 500 bei `this_week`/`next_week` im Live-Modus.
- Fix: `316d931` in Provider.
- Wirkung: Presets liefern wieder `200`.

2. Widget-Filter schienen "fest" auf USA/EZ und high/medium.
- Ursache: Serialization-Mismatch (CSV vs Array) zwischen Renderer und Main.
- Fix: `28100ef` in Native Runtime.
- Wirkung: Regions/Importance Toggle wieder wirksam.

3. Ticker Speed wirkte bei langen Presets inkonsistent zu schnell.
- Fixes: `f322264`, `28100ef`.
- Wirkung: feste Geschwindigkeitsstufen + sofortige Animation-Neustartlogik.

## 7. Gate-Status
### 7.1 Provider
- Widget Runtime Gates/Evidence dokumentiert bis E5.

### 7.2 Native
- N0 bis N5 abgeschlossen.
- W-1129: DONE.
- Release Evidence vorhanden in `02_Widget_Native_Runtime/docs/release/*` und `W1129_EVIDENCE.md`.

## 8. Verifikation und Betrieb
### 8.1 Minimal technische Checks
- Native Repo:
  - `check:shell-files`
  - `check:feed-slice`
  - `check:filter-slice`
  - `check:time-dst`

### 8.2 E2E Lauf
1. Provider starten (`SOURCE_MODE=fixtures` oder `live`).
2. Native Widget starten.
3. Settings oeffnen und Date/Regions/Importance/Speed testen.
4. Pruefen:
- Feed-Aufrufparameter wechseln sichtbar mit Settings.
- Ticker zeigt Date+Time.
- Speed-Level hat sofortige Wirkung.
- Refresh-Intervall wirkt im Polling.

## 9. Security und Compliance
- Keine Secrets in Widget-Repo.
- Source-Zugriffe nur im Provider.
- Reuters/Lizenzregeln verbleiben im Provider-Governance-Layer.

## 10. Referenzen
- `docs/WIDGET_PROJECT_BOUNDARY.md`
- `docs/WIDGET_FEED_CONTRACT.md`
- `docs/WIDGET_SETTINGS_CONTRACT.md`
- `docs/WIDGET_PROVIDER_ARTIFACT_CONTRACT.md`
- `docs/WIDGET_STYLE_GUIDE.md`
- `docs/WIDGET_STYLE_GUIDE_ALIGNMENT.md`
- `../02_Widget_Native_Runtime/docs/W1129_EVIDENCE.md`
- `../02_Widget_Native_Runtime/docs/WIDGET_BOOTSTRAP_CONTRACT.md`
