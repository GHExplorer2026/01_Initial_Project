# WIDGET_E2_FEED_INTEGRATION_PLAN.md

## Zweck
Konkreter, testbarer Plan für `W-1105` ohne Scope-Drift.
Fokus ist die Provider-seitige Feed-Integration für das Widget gemäß `WIDGET_FEED_CONTRACT.md` v1.1.

## Scope
- In Scope:
  - Contract-Tests für `GET /api/widget-feed`
  - Query-Semantik (`regions`, `datePreset`, `importance`, `currencies`, `customFrom/customTo`)
  - Response-Schema/Sortierung/Top-Konsistenz/Missing-Metrics
  - Fehlerpfade (`400`, `500`)
- Out of Scope:
  - Desktop-UI-Implementierung
  - Neue Source-Features außerhalb bestehender Governance

## Gate-Ziel (E2)
E2 gilt als bestanden, wenn alle Pflichtfälle aus diesem Plan reproduzierbar grün sind und in `WIDGET_E2_EVIDENCE.md` dokumentiert wurden.

## Testmatrix (Pflicht)

### 1) Query-Contract
1. `regions` funktioniert als Primary Parameter.
2. `countries` wird nur als deprecated alias akzeptiert.
3. Konfliktfälle (widersprüchliche Normalisierung) liefern `400`.
4. `customFrom/customTo` werden nur bei `datePreset=custom` akzeptiert.

### 2) DatePreset und Past-Regel
1. `today`: keine Vergangenheits-Events.
2. `yesterday`: Vortag darf enthalten sein.
3. `tomorrow`, `this_week`, `next_week` liefern nur passende Zeitfenster.
4. `custom`: Zeitfenster gemäß Contract, deterministisch.

### 3) Response-Contract
1. `meta` enthält `feedVersion`, `generatedAtUTC`, `parserVersion`, `sourceMode`, `sourcesUsed`, `timezoneReference`.
2. Jedes Event enthält Pflichtfelder inkl. `timeKind`, `importance`, `isTopEvent`.
3. Sortierung: `datetimeUTC`, dann `importance`, dann `region`.
4. Konsistenzregel: `importance=high` und `isTopEvent=true`.

### 4) Metrics-/No-Hallucination
1. Fehlende Werte sind `undefined`/leer im Feed, keine erfundenen Werte.
2. Response bleibt bei fehlenden Metrics valide.

### 5) Error-Contract
1. Ungültige Query -> `400` mit technischer Fehlerklasse.
2. Providerfehler -> `500` ohne sensitive Details.

## Fixture-Strategie
1. Fixture-first, kein Live-Netz in Tests.
2. Mindestens ein Fixture-Set je `datePreset`-Familie.
3. Mindestens ein Fixture-Set mit `all_day` plus `exact` Mischfall.
4. Mindestens ein Fixture-Set mit fehlenden Metrics.

## Evidence-Anforderungen
- Testlauf-Output für Contract-Suite.
- Liste der geprüften Query-Kombinationen.
- Nachweis der Sortierungs- und Konsistenzchecks.
- Dokumentierte `400`/`500` Beispielantworten ohne sensitive Payload.

## Minimaler Ablauf (token-optimiert)
1. Zielgerichtete Contract-Tests implementieren/aktualisieren.
2. Nur betroffene Test-Suite ausführen.
3. Evidence dokumentieren.
4. Erst danach nächster Schritt `W-1106`.

## Referenzen
- `docs/WIDGET_FEED_CONTRACT.md`
- `docs/WIDGET_EXECUTION_CHECKLIST.md`
- `docs/WIDGET_PROJECT_BOUNDARY.md`
- `docs/WIDGET_E2_EVIDENCE.md`
