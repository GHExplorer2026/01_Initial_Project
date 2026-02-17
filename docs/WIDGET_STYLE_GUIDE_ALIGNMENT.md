# WIDGET_STYLE_GUIDE_ALIGNMENT.md

## Ziel
Dieser Abgleich dokumentiert, welche Vorgaben aus `docs/WIDGET_STYLE_GUIDE.md` (v1.2) in die fuehrenden Widget-Vertraege uebernommen wurden.

## Fuehrende Prioritaet
1. `docs/WIDGET_SETTINGS_CONTRACT.md` (persistierte Settings, v2)
2. `docs/WIDGET_FEED_CONTRACT.md` (Feed Regeln)
3. `docs/WIDGET_IMPLEMENTATION_PLAN.md` (Scope, Delivery, Gates)
4. `docs/WIDGET_STYLE_GUIDE.md` (UI/Style Profile)

## Voll uebernommen
- Ticker-only Hauptfenster mit separatem Settings-Fenster.
- Query-Mapping mit `regions` als Primary Parameter.
- Eventdarstellung mit `Date + Time` (inkl. `All Day`) plus `A/F/P`.
- Top-Event Visualisierung fett (`isTopEvent` oder `importance=high`).
- Missing Values als `n/a`.
- Past-Regel: Vergangenheit nur mit `datePreset=yesterday`.
- Loading/Empty/Error ohne sensitive Details.

## Uebernommen mit Praezisierung
- `countryLabel` bleibt Feed-Feld fuer optionale Detailansicht.
- Ticker-Lane nutzt standardmaessig `region` fuer kompakte Darstellung.
- Widget sendet keinen Currency-Filter.

## Bewusst entfernt (v2)
- `currencies` als Widget-Settings-Feld.
- `toggleBarEnabled` und Handle-Mode.
- `tickerSpeed` als persistiertes Enum.
- `timezoneMode` als persistiertes Feld.

## Vertragsupdates durch diesen Abgleich
- `docs/WIDGET_SETTINGS_CONTRACT.md` auf v2 aktualisiert.
- `docs/WIDGET_STYLE_GUIDE.md` auf v1.2 aktualisiert.
- `docs/WIDGET_IMPLEMENTATION_PLAN.md` auf Settings v2 und Ticker-only angepasst.

## Ergebnis
Style Guide und Vertraege sind konsistent fuer das neue Native Widget UI mit separatem Settings-Fenster.
