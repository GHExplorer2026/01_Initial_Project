# RELEASE_GATE_EVIDENCE

## Zweck
Standardisiertes Evidence-Paket für Release-Gates im getrennten Desktop-Runtime-Projekt.

## Pflichtartefakte
1. `widget-runtime/artifacts/gate-metadata.json`
   - run_id
   - commit_sha
   - branch
   - started_at_utc
   - finished_at_utc
2. `widget-runtime/artifacts/checks-summary.json`
   - check:widget-runtime-freeze
   - lint
   - typecheck
   - unit
   - contract
   - build
3. `widget-runtime/artifacts/contract.log`
4. `widget-runtime/artifacts/typecheck.log`
5. `widget-runtime/artifacts/freeze.log`
6. `rollback-note.md`

## Gate-Entscheidung
- `status`: `success | failure`
- `go_no_go`: `GO | NO_GO`
- `blocking_findings`: Liste (leer bei GO)

## Mindestkriterien für GO
1. Alle Pflichtchecks sind grün.
2. Keine offenen High-Severity Findings.
3. Rollback-Pfad ist dokumentiert und getestet.
4. Contract-Freeze ist fuer den aktuellen Stand gueltig.

## Referenzen
- `widget-runtime/docs/EXECUTION_GATE.md`
- `docs/WIDGET_EXECUTION_CHECKLIST.md`
- `docs/WIDGET_E2_E3_TRANSITION.md`
