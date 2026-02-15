# RELEASES.md

## v0.1.0 (2026-02-14)

### Scope
- Merged `fix/source-mode-meta` into `main`.
- Finalized deterministic Macro Events Weekly Outlook baseline per `RULES.md` and `docs/IMPLEMENTATION_PLAN.md`.

### Highlights
- Deterministic core/server/UI pipeline with strict DE output and Outlook ICS export.
- API contract with primary `regions` and deprecated `countries` alias handling.
- Guaranteed JSON meta fields:
  - `meta.sourceMode`
  - `meta.sourcesUsed`
- ICS invariants enforced in tests:
  - CRLF + folding
  - VTIMEZONE Europe/Berlin
  - deterministic UID + DTSTAMP
  - `CATEGORIES:Wirtschafts-Event` in every VEVENT

### Quality Evidence
- Node 20 verification run reported green:
  - `unit`: pass
  - `snapshot`: pass
  - `lint`: pass
  - `typecheck`: pass
  - `build`: pass
  - tests: `89 passed`

### References
- `docs/QA_STATUS.md`
- `docs/PR_SUMMARY.md`
- `docs/PR_BODY.md`
- `docs/MERGE_STEPS.md`

## v0.1.1 (2026-02-15)

### Scope
- Parser hardening for Investing row-shape drift.
- Parser hardening for TradingView normalization drift.
- Fixture-first parser drift files committed under `tests/fixtures/sources/`.
- Deterministic orchestrator coverage for partial live-source failures.
- CI diagnostics improved with JUnit artifacts and troubleshooting guidance.

### Quality Evidence
- Local Node-20 verify gate:
  - `npm run verify:release` green (`92/92 tests`, lint/typecheck/build pass)
- Release Gate:
  - `run_id=22033462131`
  - `status=success`
  - `install=success`, `verify=success`, `smoke=success`
  - `run_url=https://github.com/GHExplorer2026/01_Initial_Project/actions/runs/22033462131`
- Published tag:
  - `v0.1.1` (annotated tag on commit `cc9f5ba`)

### References
- `docs/V0_1_1_PLAN.md`
- `docs/V0_1_1_RELEASE_DRAFT.md`
- `docs/V0_1_1_EVIDENCE.md`
- `docs/release-gate-last-success.json`

## Next Planned: v0.1.2

### Focus
- UX/UI implementation phase (scope selector, strict output rendering flow, ICS download flow).
- Preserve strict output and ICS invariants exactly as defined in `RULES.md`.
- Keep deterministic fixture-first testing and CI gate behavior.

### Planning Reference
- `docs/V0_1_2_PLAN.md`
