# WIDGET_STYLE_GUIDE.md
Version: 1.1
Status: normativ für Widget UI Umsetzung

## 0. Zweck
Dieses Dokument definiert Design, Style und UI Verhalten für das Windows Desktop Widget „Economic Events Ticker“.
Es ist verbindlich, soweit es nicht den führenden Verträgen widerspricht.

## 1. Führende Verträge und Priorität
1) WIDGET_SETTINGS_CONTRACT v1 ist führend für alle persistierten Settings Felder und Defaults.
2) WIDGET_FEED_CONTRACT v1.1 ist führend für Request, Response, Sortierung und Rendering Regeln.
3) WIDGET_IMPLEMENTATION_PLAN ist führend für Muss Soll Kann Scope und Ticker Darstellungsvertrag.

Wenn dieses Style Guide mit einem der obigen Dokumente kollidiert, gilt der Vertrag.

## 2. Produktprinzipien
• Scannbarkeit vor Vollständigkeit  
• Nicht aufdringlich, dauerhaft sichtbar, keine Unterbrechung  
• Keine erfundenen Werte, fehlende Felder als n/a  
• UTC intern, Anzeige lokal über Windows Zeitzone, DST beachten  
• Kein direkter Source Fetch im Widget, Widget ist reiner Feed Consumer  

## 3. Terminologie
• Widget Bar: das schmale Hauptfenster des Widgets  
• Ticker Lane: der Bereich, der Events als Lauftext darstellt  
• Control Cluster: kleine Controls rechts, z.B. Settings  
• Settings Panel: Konfiguration, persistiert nach Settings Contract v1  
• Handle Mode: minimale UI, wenn toggleBarEnabled=false  

## 4. UI Komponenten
### 4.1 Widget Bar
Ziel: eine schmale Leiste, frei positionierbar, mit Ticker Lane und Control Cluster.

Pflicht Eigenschaften
• frei verschiebbar per Drag auf nicht klickbaren Flächen  
• optional Always on Top über Settings alwaysOnTop  
• Transparenz über Settings transparency  
• sichtbar oder verborgen über Settings toggleBarEnabled  

Empfohlen
• Snap zu Bildschirmkanten  
• Multi Monitor Position Restore als Kann Feature  

### 4.2 Ticker Lane
Ziel: laufende Darstellung von Events in Feed Reihenfolge.

Default Verhalten
• Ticker Modus: kontinuierlich  
• Ticker Speed: normal gemäß Settings tickerSpeed  
• Pause bei Hover empfohlen  
• Klick auf Item öffnet Detail oder Quelle in sekundärem UI, ohne den Lauftext aufzublähen  

Hinweis
Ticker Modus Toggle ist ein UI Feature und ist nicht Teil des Settings Contract v1.
Er darf als Runtime Toggle existieren, aber v1 nicht persistieren.

### 4.3 Control Cluster
Minimal
• Settings Button  
• Play Pause Toggle empfohlen  
• Indikator für Feed Status als Soll Feature  

Optional
• Pin Toggle als UI Spiegel von alwaysOnTop  
• Close minimiert in Handle Mode, nicht destruktiv  

### 4.4 Settings Panel
Settings Panel ist die einzige Stelle, die persistierte Settings verändert.
Die Felder und Defaults müssen exakt dem WIDGET_SETTINGS_CONTRACT v1 entsprechen.

### 4.5 Handle Mode
Wenn toggleBarEnabled=false
• Widget Bar ist verborgen  
• Stattdessen bleibt ein kleines reaktivierbares UI Element sichtbar, z.B. schmaler Handle oder Tray Entry  
• Reaktivierung setzt toggleBarEnabled=true  

## 5. Visuelle Tokens
### 5.1 Theme
Default: Dark  
Toggle: Light ist erlaubt als UI Feature.

Hinweis
Theme Toggle ist nicht Teil des Settings Contract v1.
Er darf als Runtime Toggle existieren oder als v2 Erweiterung geplant werden.

### 5.2 Größen und Spacing
Empfohlene Default Maße
• Höhe: 48 px  
• Breite: 820 px  
• Corner Radius: 14 px  
• Padding: 12 px horizontal, 8 px vertikal  
• Control Hit Area: mindestens 28 px  

### 5.3 Typografie
• System Font  
• Ticker Text: 13 bis 15 px  
• Badges und Meta: 11 bis 12 px  
• Top Event Titel: fett  
• Keine Caps Locks Texte als Standard  

### 5.4 Farbe und Kontrast
Ziel: ruhige Flächen, klare Lesbarkeit auf variablen Desktop Hintergründen.

Dark Default Vorschlag
• Surface: sehr dunkles Grau  
• Text: hell  
• Separatoren: subtil  
• Status Farben sparsam und nur als sekundäre Signale  
• Wichtig: Bedeutung niemals nur über Farbe, immer zusätzlich Form oder Text  

### 5.5 Transparenz Mapping
Settings transparency ist 0 bis 100.
Empfohlenes Mapping
• 0 sehr transparent  
• 100 deckend  
Default ist 90.

## 6. Daten und Rendering Regeln
### 6.1 Feed Consumer Regeln
• Endpoint: GET /api/widget-feed  
• Widget sendet keine deprecated Query Aliases, nur regions als primary Param  
• Widget setzt datePreset, customFrom, customTo gemäß Settings Regeln  
• Widget filtert zusätzlich defensiv, falls Feed inkonsistent liefert, ohne Werte zu erfinden  

### 6.2 Settings zu Feed Query Mapping
Settings Feldname bleibt exakt, auch wenn UI Label „Region“ sagt.

Mapping
1) settings.countries  
• UI Label: Regionen  
• Request Query: regions=…  
• Allowed Values: USA, EZ, UK, JP, CH, CA, AU, NZ  

2) settings.currencies  
• Request Query: currencies=…  
• Values kommen aus Feed Provider Allowed Set  

3) settings.importanceLevels  
• Request Query: importance=…  
• Allowed Values: high, medium, low, unknown  

4) settings.datePreset  
• Request Query: datePreset=…  

5) settings.customFrom, settings.customTo  
• Nur wenn datePreset=custom  
• Sonst ignorieren und nicht senden  

### 6.3 Event Line Template in der Ticker Lane
Pflicht Inhalte pro Event
• lokale Zeit oder All Day Label  
• Country oder Region  
• Event Titel  
• Actual, Forecast, Previous  
• fehlende Werte als n/a  
• Top Events visuell fett  

Display Template
1) exact
[HH:MM] [region] [titleRaw]  A:[actual|n/a]  F:[forecast|n/a]  P:[previous|n/a]

2) all_day
All Day [region] [titleRaw]  A:[actual|n/a]  F:[forecast|n/a]  P:[previous|n/a]

Top Event Regeln
• Wenn isTopEvent=true dann Titel fett  
• Zusätzlich optional ein kleiner TOP Badge, aber ohne zusätzlichen Textmüll  
• Konsistenz ist durch Feed garantiert, Widget rendert defensiv  

Country Label
• countryLabel ist für Tooltip oder Detail Panel  
• In der Lane wird region bevorzugt, um Platz zu sparen  

### 6.4 Sortierung
• Feed liefert bereits sortiert: datetimeUTC, importance, region  
• Widget darf nach Filterung die relative Reihenfolge beibehalten  
• Widget sortiert nicht neu, außer es ist für UI Gruppierung explizit gefordert und dokumentiert  

### 6.5 Past Regel
• Vergangene Events dürfen nur angezeigt werden, wenn datePreset=yesterday aktiv ist  
• Widget zeigt keine Vergangenheit in anderen Presets  
• Custom Dates bleibt vorwärtsgerichtet ab nowUTC, mit derselben Yesterday Ausnahme  

## 7. Interaktion
### 7.1 Drag und Position
• Drag auf Surface Bereiche, nicht auf Buttons und nicht auf klickbare Items  
• Während Drag: leichter Shadow und Snap Preview  
• Position Persistenz ist Kann Feature, wenn vorhanden dann pro Monitor Setup  

### 7.2 Hover Verhalten
• Pause bei Hover empfohlen  
• Tooltip zeigt countryLabel, source, generatedAtUTC und lokale Zeit des Events  
• Tooltip zeigt niemals Hashes als Pflicht, sourceUrlHash ist optional und sollte nicht als UX Element erscheinen  

### 7.3 Klick Verhalten
• Klick auf Event öffnet Detail Panel oder Source View  
• Detail Panel zeigt die Felder aus Feed Event plus provenance.fetchedAtISO  
• Keine eigenen Berechnungen wie Surprise oder Delta in v1  

### 7.4 Keyboard
Empfohlen Minimum
• Tab navigiert Controls  
• Enter aktiviert fokussiertes Control  
• Esc schließt Settings Panel  

## 8. Zustände und Status Anzeige
### 8.1 Loading
• dezenter Text oder kleiner Indikator rechts  
• keine blockierenden Dialoge  

### 8.2 Empty
• „Keine Events im aktuellen Filter“  
• Shortcut „Settings öffnen“  

### 8.3 Error
• Kurzer Hinweis „Feed nicht erreichbar“  
• Wenn Last Good Cache aktiv ist, weiter anzeigen plus Hinweis „Cache“  
• Kein sensibler Debug Output in der UI  

### 8.4 Feed Qualität Indicator
Soll Feature
• Indicator zeigt sourceMode fixtures oder live  
• Tooltip zeigt generatedAtUTC und parserVersion  
• sourcesUsed nur im Tooltip oder Detail View, nicht im Lauftext  

## 9. Accessibility
• Kontrast muss auch bei transparency Default 90 lesbar bleiben  
• Reduce Motion Option empfohlen, setzt tickerSpeed automatisch auf slow oder nutzt Step Mode  
• Bedeutung niemals nur über Farbe, zusätzlich Text oder Icon  

## 10. Compliance und Datenintegrität
• Keine eigenen Werte erfinden  
• Fehlende Metrics exakt als n/a rendern  
• Keine Source Fetch Logik im Widget  
• Keine Secrets im UI oder Logs  
• Fehlerpayload nur technische Klasse, UI zeigt userfreundlichen Text  

## 11. Umsetzung Checkliste
Pflicht zum Merge in Gate 3
• Settings Felder exakt wie Contract v1, inklusive Defaults, Normalisierung und Logging  
• Feed Request und Response Handling exakt wie Contract v1.1  
• Ticker Darstellungsvertrag erfüllt  
• All Day Label korrekt  
• Top Events fett  
• Past Regel umgesetzt  
• UTC intern, lokale Anzeige via Windows Zeitzone, DST verifiziert  

Soll zum Merge in Gate 4
• Last Good Feed Cache  
• Polling Backoff  
• Feed Quality Indicator  

Kann
• Hotkey für Toggle Bar  
• Multi Monitor Restore  
• Ticker Dichte Profile  
