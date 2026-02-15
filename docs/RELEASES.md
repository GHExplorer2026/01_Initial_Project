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

## v0.1.2 (2026-02-15)

### Scope
- Implemented UX/UI flow for scope selection, generation, and ICS download.
- Added deterministic scope-state/request helpers for `regions`-primary behavior.
- Added UI contract tests and strengthened accessibility semantics.
- Preserved strict output and ICS product contracts without rule drift.

### Quality Evidence
- Local Node-20 verify gate:
  - `TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run verify:release`
  - result: `105/105 tests` passed + lint/typecheck/build pass
- Release Gate:
  - `run_id=22034113407`
  - `status=success`
  - `install=success`, `verify=success`, `smoke=success`
  - `run_url=https://github.com/GHExplorer2026/01_Initial_Project/actions/runs/22034113407`
- Published tag:
  - `v0.1.2` (annotated tag on commit `662a368`)

### References
- `docs/V0_1_2_PLAN.md`
- `docs/V0_1_2_RELEASE_DRAFT.md`
- `docs/V0_1_2_EVIDENCE.md`
- `docs/release-gate-last-success.json`

## v0.1.3 (2026-02-15)

### Scope
- Completed operational hardening for runtime alignment and gate stability.
- Expanded SPEC-safe fallback/query-contract coverage without rule drift.
- Closed release evidence with green verify and release-gate markers.

### Quality Evidence
- Local Node-20 verify gate:
  - `TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run verify:release`
  - result: `109/109` tests passed + lint/typecheck/build pass
- Release Gate:
  - `run_id=22034682380`
  - `status=success`
  - `install=success`, `verify=success`, `smoke=success`
  - `run_url=https://github.com/GHExplorer2026/01_Initial_Project/actions/runs/22034682380`
- Published tag:
  - `v0.1.3` (annotated tag on commit `1e15616`)

### References
- `docs/V0_1_3_PLAN.md`
- `docs/V0_1_3_RELEASE_DRAFT.md`
- `docs/V0_1_3_EVIDENCE.md`
- `docs/release-gate-last-success.json`

## Next Planned: v0.1.4

### Focus
- Baseline verification and release-gate refresh after `v0.1.3` release.
- Runbook hardening for deterministic operations under intermittent DNS/network issues.
- Additional SPEC-safe fallback/contract coverage with fixture-first tests.
- Current gate status: `READY FOR TAG` (release-candidate marker `run_id=22034861927`).

### Planning Reference
- `docs/V0_1_4_PLAN.md`
- `docs/V0_1_4_RELEASE_DRAFT.md`
- `docs/V0_1_4_EVIDENCE.md`
