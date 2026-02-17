# RELEASES.md

## post-v0.1.8 planning package (2026-02-17, no new tag)

### Scope
- Added Windows Desktop Widget Option-C implementation plan and delivery strategy.
- Added versioned widget contracts for feed and settings.
- Added split-delivery playbook for separated desktop UI project execution.
- Added modular widget skills for planning, contracts, UI, timezone QA, security, and release gating.
- Added Widget Style Guide import and contract alignment decisions.
- Added widget execution checklist to bridge planning contracts to implementation gates.
- Added widget project-boundary baseline for separated UI runtime and CI gates.
- Added E2 feed-integration plan and evidence template for deterministic gate closure.
- Added widget-feed API endpoint and E2 route-contract tests.
- Added widget E3 preview UI slice and targeted UI-client contract tests.
- Added explicit widget-feed contract CI gate for baseline execution closure.
- Added consolidated E2->E3 transition evidence for desktop runtime handoff.
- Added initial separated runtime scaffold docs under `widget-runtime/`.
- Added release-gate evidence template for separated runtime repository handoff.
- Added runtime smoke script and blocker note for agent-shell port-bind limitation.
- Added runtime settings persistence migration and lane-state UX hardening in widget-preview slice.

### Quality Evidence
- Planning artifacts are decision-complete and traceable in repository docs.
- Existing release gate remains green for current `main` baseline (`run_id=22108356856`).

### References
- `docs/WIDGET_IMPLEMENTATION_PLAN.md`
- `docs/WIDGET_FEED_CONTRACT.md`
- `docs/WIDGET_SETTINGS_CONTRACT.md`
- `docs/WIDGET_SPLIT_DELIVERY_PLAYBOOK.md`
- `docs/WIDGET_STYLE_GUIDE.md`
- `docs/WIDGET_STYLE_GUIDE_ALIGNMENT.md`
- `docs/WIDGET_EXECUTION_CHECKLIST.md`
- `docs/WIDGET_PROJECT_BOUNDARY.md`
- `docs/WIDGET_E2_FEED_INTEGRATION_PLAN.md`
- `docs/WIDGET_E2_EVIDENCE.md`
- `src/app/api/widget-feed/route.ts`
- `src/server/widgetFeed.ts`
- `tests/api.widget-feed.route.test.ts`
- `src/app/widget-preview/page.tsx`
- `src/app/widgetPreviewClient.ts`
- `tests/widgetPreviewClient.test.ts`
- `docs/WIDGET_E3_EVIDENCE.md`
- `.github/workflows/ci.yml`
- `package.json`
- `docs/WIDGET_E2_E3_TRANSITION.md`
- `widget-runtime/README.md`
- `widget-runtime/docs/SCOPING.md`
- `widget-runtime/docs/EXECUTION_GATE.md`
- `widget-runtime/docs/RELEASE_GATE_EVIDENCE.md`
- `scripts/smoke_widget_runtime.sh`
- `docs/WIDGET_E2E_SMOKE_BLOCKER.md`
- `docs/WIDGET_E4_PERSISTENCE_UX_EVIDENCE.md`
- `src/app/widgetPreviewClient.ts`
- `src/app/widget-preview/page.tsx`
- `tests/widgetPreviewClient.test.ts`
- `skills/windows-widget-planning-gate/*`
- `skills/widget-*`

## v0.1.8 candidate (2026-02-17, tag pending)

### Scope
- Added UI strict-output visibility toggle with default `off`.
- Added deterministic TOP/importance equivalence normalization (`TOP-EVENT <=> importance=high`).
- Added ICS pre-export importance filters (`icsImportance=high,medium`) with OR semantics and no-filter => all.
- Updated CI smoke UI assertions to align with strict-output toggle default-hidden contract.

### Quality Evidence
- Local Node-20 verify gate:
  - `TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run verify`
  - result: `145/145` tests passed + lint/typecheck/build/check:next-env pass
- Release Gate:
  - `run_id=22108356856`
  - `status=success`
  - `install=success`, `verify=success`, `smoke=success`
  - `run_url=https://github.com/GHExplorer2026/01_Initial_Project/actions/runs/22108356856`

### References
- `docs/V0_1_8_PLAN.md`
- `docs/V0_1_8_RELEASE_DRAFT.md`
- `docs/V0_1_8_EVIDENCE.md`
- `docs/release-gate-last-success.json`

## post-v0.1.7 maintenance (2026-02-15, no new tag)

### Scope
- Closed documentation and QA baseline on a consolidated handoff state.
- Added sprint mitigation governance (DoR/DoD/security/cycle) to rules and skills.
- Added and stabilized Windows desktop one-click launcher for live runtime.

### Quality Evidence
- UI/Desktop runtime validation:
  - successful launcher run in live mode from Windows PowerShell
  - WSL dev server startup confirmed
  - browser open and scoped weekly/ICS API calls confirmed
- Release Gate marker (latest successful run before this maintenance closure):
  - `run_id=22040211283`
  - `status=success`
  - `install=success`, `verify=success`, `smoke=success`
  - `run_url=https://github.com/GHExplorer2026/01_Initial_Project/actions/runs/22040211283`

### References
- `docs/QA_STATUS.md`
- `docs/UI_EXECUTION_REPORT.md`
- `docs/NEXT_SPRINT_HANDOFF.md`
- `docs/release-gate-last-success.json`

## v0.1.7 (2026-02-15)

### Scope
- Completed SPEC-safe UI execution hardening with deterministic metadata ordering and error normalization.
- Completed deterministic release-evidence alignment and gate rerun closure.
- Preserved strict output and ICS product contracts without schema/string drift.

### Quality Evidence
- Local Node-20 verify gate:
  - `TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run verify:release`
  - result: `130/130` tests passed + lint/typecheck/build pass
- Release Gate:
  - `run_id=22038553850`
  - `status=success`
  - `install=success`, `verify=success`, `smoke=success`
  - `run_url=https://github.com/GHExplorer2026/01_Initial_Project/actions/runs/22038553850`
- Published tag:
  - `v0.1.7` (annotated tag on commit `f2010a0`)

### References
- `docs/V0_1_7_PLAN.md`
- `docs/V0_1_7_RELEASE_DRAFT.md`
- `docs/V0_1_7_EVIDENCE.md`
- `docs/release-gate-last-success.json`

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

## v0.1.4 (2026-02-15)

### Scope
- Baseline verification and release-gate refresh after `v0.1.3`.
- Runbook hardening for deterministic operations under intermittent DNS/network behavior.
- Additional SPEC-safe fallback/contract coverage with fixture-first tests.

### Quality Evidence
- Local Node-20 verify gate:
  - `TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run verify:release`
  - result: `111/111` tests passed + lint/typecheck/build pass
- Release Gate:
  - `run_id=22035048334`
  - `status=success`
  - `install=success`, `verify=success`, `smoke=success`
  - `run_url=https://github.com/GHExplorer2026/01_Initial_Project/actions/runs/22035048334`
- Published tag:
  - `v0.1.4` (annotated tag on commit `617cf21`)

### References
- `docs/V0_1_4_PLAN.md`
- `docs/V0_1_4_RELEASE_DRAFT.md`
- `docs/V0_1_4_EVIDENCE.md`
- `docs/release-gate-last-success.json`

## v0.1.5 (2026-02-15)

### Scope
- Completed SPEC-safe live-mode adapter resilience hardening.
- Expanded deterministic fixture/contract coverage for source utilities and adapters.
- Hardened release-gate diagnostics with explicit run/step/tail details.

### Quality Evidence
- Local Node-20 verify gate:
  - `TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run verify:release`
  - result: `115/115` tests passed + lint/typecheck/build pass
- Release Gate:
  - `run_id=22035467485`
  - `status=success`
  - `install=success`, `verify=success`, `smoke=success`
  - `run_url=https://github.com/GHExplorer2026/01_Initial_Project/actions/runs/22035467485`
- Published tag:
  - `v0.1.5` (annotated tag on commit `9beb641`)

### References
- `docs/V0_1_5_PLAN.md`
- `docs/V0_1_5_RELEASE_DRAFT.md`
- `docs/V0_1_5_EVIDENCE.md`
- `docs/release-gate-last-success.json`

## v0.1.6 (2026-02-15)

### Scope
- Completed SPEC-safe contract-proofing hardening on top of `v0.1.5`.
- Hardened deterministic fallback note-line test coverage.
- Hardened release-operability runbook for marker mismatch diagnosis.

### Quality Evidence
- Local Node-20 verify gate:
  - `TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run verify:release`
  - result: `115/115` tests passed + lint/typecheck/build pass
- Release Gate:
  - `run_id=22035813418`
  - `status=success`
  - `install=success`, `verify=success`, `smoke=success`
  - `run_url=https://github.com/GHExplorer2026/01_Initial_Project/actions/runs/22035813418`
- Published tag:
  - `v0.1.6` (annotated tag on commit `a2848c5`)

### References
- `docs/V0_1_6_PLAN.md`
- `docs/V0_1_6_RELEASE_DRAFT.md`
- `docs/V0_1_6_EVIDENCE.md`
- `docs/release-gate-last-success.json`
