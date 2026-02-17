# RELEASE_GATE_EVIDENCE

## Zweck
Standardisiertes Evidence-Paket für Release-Gates im getrennten Desktop-Runtime-Projekt.

## Pflichtartefakte
1. `gate-metadata.json`
   - run_id
   - commit_sha
   - branch
   - started_at_utc
   - finished_at_utc
2. `checks-summary.json`
   - lint
   - typecheck
   - unit
   - contract
   - build
3. `test-report.xml` (oder gleichwertiger Report)
4. `smoke-log.txt`
5. `rollback-note.md`

## Gate-Entscheidung
- `status`: `success | failure`
- `go_no_go`: `GO | NO_GO`
- `blocking_findings`: Liste (leer bei GO)

## Mindestkriterien für GO
1. Alle Pflichtchecks sind grün.
2. Keine offenen High-Severity Findings.
3. Rollback-Pfad ist dokumentiert und getestet.

## Referenzen
- `widget-runtime/docs/EXECUTION_GATE.md`
- `docs/WIDGET_EXECUTION_CHECKLIST.md`
- `docs/WIDGET_E2_E3_TRANSITION.md`
