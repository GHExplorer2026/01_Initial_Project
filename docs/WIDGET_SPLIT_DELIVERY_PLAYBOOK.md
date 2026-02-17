# WIDGET_SPLIT_DELIVERY_PLAYBOOK.md

## Ziel
Schritt für Schritt Vorgehen für Option C mit sauberer Trennung:
- bestehendes Projekt als Feed Provider
- neues Desktop Projekt als Widget UI Consumer

## Phase 1 Contract Freeze
1. Feed Contract `v1.1` finalisieren.
2. Settings Contract `v1` finalisieren.
3. Akzeptanzkriterien für Date Filter und Past Regel fixieren.
4. Style Guide `v1.1` gegen Contracts mappen und Übernahmen dokumentieren.

## Phase 2 Repository Setup
1. Neues Desktop Projekt anlegen.
2. CI und Release Gates für Desktop Projekt aufsetzen.
3. Verlinkung zum Feed Provider dokumentieren.

## Phase 3 Feed Provider Erweiterung
1. Widget Feed Endpoint ergänzen.
2. Bestehende Governance Regeln unverändert übernehmen.
3. Contract Tests grün machen.

## Phase 4 Desktop Vertical Slice
1. Widget Shell mit Positionierung.
2. Ticker mit Fixture Feed.
3. Settings Basisfelder und Persistenz.
4. Handle Mode, Empty/Error-States und Control Cluster Mindestumfang umsetzen.

## Phase 5 Filter und Zeitlogik
1. Date Presets implementieren.
2. Past Regel plus Yesterday Ausnahme.
3. Windows Timezone Anzeige plus DST Tests.

## Phase 6 Quality und Hardening
1. Error und Offline Pfade.
2. Last Good Cache.
3. Performance und Render Stabilität.
4. Accessibility Minimum (Kontrast, Keyboard, Reduce-Motion-Verhalten) verifizieren.

## Phase 7 RC und Rollback
1. Vollständige Testmatrix.
2. Security und Compliance Checks.
3. Rollback Drill und RC Freigabe.

## Deliverables je Phase
- Plan/Spec Dokument
- Contract Test Report
- UI und Integration Test Report
- Release Gate Evidence
- Style-Guide Alignment Log (welche Regeln übernommen/nicht übernommen wurden)
