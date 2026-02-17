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
   - `check_widget_runtime_freeze`
   - `contract`
   - `typecheck`
   - `lint`
   - `unit`
   - `build`
   - `security_compliance`
   - `rollback`
   - `status`
3. `widget-runtime/artifacts/contract.log`
4. `widget-runtime/artifacts/typecheck.log`
5. `widget-runtime/artifacts/freeze.log`
6. `widget-runtime/artifacts/lint.log`
7. `widget-runtime/artifacts/unit.log`
8. `widget-runtime/artifacts/build.log`
9. `widget-runtime/artifacts/security-compliance.log`
10. `widget-runtime/artifacts/rollback.log`
11. `widget-runtime/docs/SECURITY_COMPLIANCE_EVIDENCE.md`
12. `widget-runtime/docs/ROLLBACK_DRILL_EVIDENCE.md`

## Profile
1. Dry-Run Profile:
   - `check_widget_runtime_freeze`
   - `contract`
   - `typecheck`
2. Full-RC Profile (Gate E5 Zielprofil, default):
   - Dry-Run Profile plus `lint`, `unit`, `build`, `security_compliance`, `rollback`.

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
