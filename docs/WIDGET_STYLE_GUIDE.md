# WIDGET_STYLE_GUIDE.md
Version: 1.2
Status: normativ fuer Widget UI Umsetzung

## 0. Zweck
Dieses Dokument definiert Design, Style und UI Verhalten fuer das Windows Desktop Widget "Economic Events Ticker".

## 1. Fuehrende Vertraege und Prioritaet
1. `WIDGET_SETTINGS_CONTRACT` v2 ist fuehrend fuer persistierte Settings.
2. `WIDGET_FEED_CONTRACT` v1.1 ist fuehrend fuer Feed Request/Response und Sortierung.
3. `WIDGET_IMPLEMENTATION_PLAN` ist fuehrend fuer Scope und Delivery.

## 2. Produktprinzipien
- Scannbarkeit vor Vollstaendigkeit.
- Ticker ist dauerhaft schlank, Settings in separatem Fenster.
- Keine erfundenen Werte, fehlende Felder als `n/a`.
- UTC intern, Anzeige lokal ueber Windows Zeitzone.
- Kein direkter Source Fetch im Widget.

## 3. UI Komponenten
### 3.1 Ticker Hauptfenster
Pflicht:
- sehr kompakte Leiste mit Lauftext als Hauptinhalt
- frei verschiebbar
- optionale Always-on-top Spiegelung
- Transparenz aus Settings
- Gear Button oeffnet Settings-Fenster
- Pin und Close als kompakte Aktionen erlaubt

### 3.2 Settings Fenster
Pflicht:
- einzige Stelle fuer persistierte Settings
- Felder exakt nach `WIDGET_SETTINGS_CONTRACT` v2
- Apply aktualisiert Ticker unmittelbar

### 3.3 Ticker Lane
Pflicht:
- kontinuierliche Laufschrift
- Feed-Reihenfolge beibehalten
- Top-Events fett rendern

## 4. Daten- und Renderregeln
### 4.1 Query Mapping
- Widget sendet `regions` als Primary Scope Parameter.
- Widget sendet `datePreset` und optional `customFrom/customTo`.
- Widget sendet optional `importance`.
- Widget sendet keinen Currency-Filter.

### 4.2 Event Line Template
Pflicht Inhalte pro Event:
- `Date + Time` lokal (`DD.MM.YYYY, HH:MM`) oder `DD.MM.YYYY, All Day`
- `region`
- `titleRaw`
- `A/F/P` Werte (`n/a` falls fehlend)

Template:
- `[DD.MM.YYYY, HH:MM] [region] [title] | A:[actual|n/a] F:[forecast|n/a] P:[previous|n/a]`
- `[DD.MM.YYYY, All Day] [region] [title] | A:[actual|n/a] F:[forecast|n/a] P:[previous|n/a]`

Top Event Regeln:
- `isTopEvent=true` oder `importance=high` wird fett.

## 5. Groesse und Typografie
- Ticker-Font groesse konfigurierbar (`fontSizePx`).
- Widget-Groesse passt sich dynamisch an Fontgroesse an.
- Standard-Font: System Font.

## 6. Status und Fehler
- Loading: dezente Statusmeldung.
- Empty: "Keine Events im aktuellen Filter".
- Error: "Feed nicht erreichbar" ohne sensitive Details.

## 7. A11y
- ausreichender Kontrast auch mit Transparenz.
- Bedeutungen nie nur ueber Farbe.
- Keyboard-Basis fuer Settings-Fenster (Tab, Enter, Esc).

## 8. Compliance
- Keine Daten erfinden.
- Keine Secrets im UI oder Logs.
- Keine Source-Fetch-Logik im Widget.
