# Project Progress and Governance

## 1. Project Context
- Project: `01_Initial_Project`
- Current objective: keep a consolidated, release-stable baseline and start the next scope from a clean Sprint entry point.
- Single source of truth for implementation governance: this `README.md`.

## 2. Current Snapshot
Date: `2026-02-17`

| Area | Status | Completion | Last Updated | Evidence |
|---|---|---:|---|---|
| Domain rules baseline | Completed | 100% | 2026-02-08 | `RULES.md` |
| Legacy startup skills archived | Completed | 100% | 2026-02-08 | `skills/_legacy-startup/*` |
| New domain skill set | Completed | 100% | 2026-02-08 | `skills/*` (new folders listed below) |
| Detailed implementation plan | Completed | 100% | 2026-02-08 | `docs/IMPLEMENTATION_PLAN.md` |
| Core/API baseline implementation | Completed | 100% | 2026-02-14 | `src/core/*`, `src/server/*`, `src/app/api/*` |
| Deterministic test harness | Completed | 100% | 2026-02-14 | `tests/*`, `tests/fixtures/golden/*` |
| CI quality gates incl. snapshot | Completed | 100% | 2026-02-14 | `.github/workflows/*.yml`, `package.json` |
| Release `v0.1.1` | Completed | 100% | 2026-02-15 | tag `v0.1.1`, `docs/RELEASES.md`, `docs/V0_1_1_EVIDENCE.md` |
| `v0.1.2` planning baseline | Completed | 100% | 2026-02-15 | `docs/V0_1_2_PLAN.md` |
| Release `v0.1.2` | Completed | 100% | 2026-02-15 | tag `v0.1.2`, `docs/RELEASES.md`, `docs/V0_1_2_EVIDENCE.md` |
| `v0.1.3` planning baseline | Completed | 100% | 2026-02-15 | `docs/V0_1_3_PLAN.md`, `docs/V0_1_3_EVIDENCE.md` |
| Release `v0.1.3` | Completed | 100% | 2026-02-15 | tag `v0.1.3`, `docs/RELEASES.md`, `docs/V0_1_3_EVIDENCE.md` |
| `v0.1.4` planning baseline | Completed | 100% | 2026-02-15 | `docs/V0_1_4_PLAN.md`, `docs/V0_1_4_EVIDENCE.md` |
| Release `v0.1.4` | Completed | 100% | 2026-02-15 | tag `v0.1.4`, `docs/RELEASES.md`, `docs/V0_1_4_EVIDENCE.md` |
| `v0.1.5` planning baseline | Completed | 100% | 2026-02-15 | `docs/V0_1_5_PLAN.md`, `docs/V0_1_5_RELEASE_DRAFT.md`, `docs/V0_1_5_EVIDENCE.md` |
| Release `v0.1.5` | Completed | 100% | 2026-02-15 | tag `v0.1.5`, `docs/RELEASES.md`, `docs/V0_1_5_EVIDENCE.md` |
| `v0.1.6` planning baseline | Completed | 100% | 2026-02-15 | `docs/V0_1_6_PLAN.md`, `docs/V0_1_6_RELEASE_DRAFT.md`, `docs/V0_1_6_EVIDENCE.md` |
| Release `v0.1.6` | Completed | 100% | 2026-02-15 | tag `v0.1.6`, `docs/RELEASES.md`, `docs/V0_1_6_EVIDENCE.md` |
| `v0.1.7` planning baseline | Completed | 100% | 2026-02-15 | `docs/V0_1_7_PLAN.md`, `docs/V0_1_7_RELEASE_DRAFT.md`, `docs/V0_1_7_EVIDENCE.md` |
| Release `v0.1.7` | Completed | 100% | 2026-02-15 | tag `v0.1.7`, `docs/RELEASES.md`, `docs/V0_1_7_EVIDENCE.md` |
| Post-`v0.1.7` maintenance closure | Completed | 100% | 2026-02-15 | `docs/QA_STATUS.md`, `docs/UI_EXECUTION_REPORT.md`, `docs/NEXT_SPRINT_HANDOFF.md` |
| UI Update sprint (Date+Time table + All-Day + ICS metrics) | Completed | 100% | 2026-02-17 | `src/app/page.tsx`, `src/core/icsSerializer.ts`, `RULES.md`, `docs/IMPLEMENTATION_PLAN.md` |
| `v0.1.8` planning gate package (no-code phase) | Completed | 100% | 2026-02-17 | `skills/ui-update-next-iteration-planning-gate/*`, `docs/V0_1_8_PLAN.md`, `docs/V0_1_8_EVIDENCE.md` |
| `v0.1.8` execution slice (strict toggle + ICS importance filter) | Completed | 100% | 2026-02-17 | `src/app/page.tsx`, `src/app/api/weekly.ics/route.ts`, `src/server/orchestrator.ts`, `RULES.md`, `docs/V0_1_8_EVIDENCE.md` |
| Windows Widget Option-C planning package | Completed | 100% | 2026-02-17 | `docs/WIDGET_IMPLEMENTATION_PLAN.md`, `docs/WIDGET_FEED_CONTRACT.md`, `docs/WIDGET_SETTINGS_CONTRACT.md`, `docs/WIDGET_STYLE_GUIDE.md`, `skills/widget-*` |

## 3. Active Skill Landscape

### Legacy (archived)
- `skills/_legacy-startup/idea-to-prd`
- `skills/_legacy-startup/architecture-baseline`
- `skills/_legacy-startup/repo-bootstrap`
- `skills/_legacy-startup/mvp-delivery-plan`

### Active domain skills
- `skills/weekly-outlook-orchestrator`
- `skills/source-governance-fetch`
- `skills/event-normalization-classification`
- `skills/conflict-dedupe-grouping`
- `skills/strict-renderer-de`
- `skills/outlook-ics-generator`
- `skills/frontend-style-glass-dark`
- `skills/deterministic-qa-harness`
- `skills/spec-safe-direct-delivery`
- `skills/economic-calendar-table-contract`
- `skills/ui-update-next-iteration-planning-gate`
- `skills/windows-widget-planning-gate`
- `skills/widget-feed-contract`
- `skills/widget-settings-contract`
- `skills/widget-ticker-ui-contract`
- `skills/widget-timezone-dst-qa`
- `skills/widget-security-compliance`
- `skills/widget-release-gate`

## 4. Progress Log
| ID | Date | Area | Type | Description | Result | Verification | Owner |
|---|---|---|---|---|---|---|---|
| P-001 | 2026-02-08 | Skills | Migration | Moved generic startup skills to legacy archive | Completed | Folder structure verified | Codex |
| P-002 | 2026-02-08 | Skills | Creation | Added 8 domain-specific skills with references | Completed | Skill folders and files created | Codex |
| P-003 | 2026-02-08 | Rules | Rewrite | Replaced generic rules with 15 hard acceptance rules | Completed | `RULES.md` updated | Codex |
| P-004 | 2026-02-08 | Planning | Creation | Added detailed implementation plan document | Completed | `docs/IMPLEMENTATION_PLAN.md` present | Codex |
| P-005 | 2026-02-08 | Documentation | Rewrite | Updated project README for new setup and governance | Completed | This file | Codex |
| P-006 | 2026-02-08 | Build Infra | Creation | Added multi-stage Docker build and CI image artifact workflow | Completed | `Dockerfile`, `.github/workflows/build-image.yml` | Codex |
| P-007 | 2026-02-14 | Core/API | Implementation | Implemented orchestrator, source adapters, strict renderer integration, and weekly/ICS API routes | Completed | `src/server/orchestrator.ts`, `src/app/api/weekly/route.ts`, `src/app/api/weekly.ics/route.ts` | Codex |
| P-008 | 2026-02-14 | QA | Hardening | Expanded deterministic tests (core, adapters, API contracts, snapshots, fallback behavior) | Completed | `tests/*` (92 tests passing in Node-20 verification run) | Codex |
| P-009 | 2026-02-14 | CI | Hardening | Added explicit snapshot gate in CI workflows and consolidated local verify command | Completed | `.github/workflows/ci.yml`, `.github/workflows/build-image.yml`, `package.json` | Codex |
| P-010 | 2026-02-14 | API Meta | Fix | Stabilized and enforced `meta.sourceMode`/`meta.sourcesUsed` semantics in orchestrator output | Completed | `src/server/orchestrator.ts`, `tests/orchestrator.test.ts` | Codex |
| P-011 | 2026-02-14 | Toolchain | Hardening | Enforced Node 20 baseline (`.nvmrc`/`.node-version`) and CI `npm ci`-only installs | Completed | `package.json`, `.nvmrc`, `.node-version`, `.github/workflows/*.yml` | Codex |
| P-012 | 2026-02-14 | QA | Edge-case expansion | Added tests for weekend week-window orchestration and empty `regions` + deprecated `countries` alias fallback | Completed | `tests/orchestrator.test.ts`, `tests/scope.test.ts`, `tests/api.weekly*.test.ts` | Codex |
| P-013 | 2026-02-14 | Release | Finalization | Merged feature branch to `main`, published tag `v0.1.0`, and cleaned up remote feature branch | Completed | `main`, `docs/RELEASES.md`, tag `v0.1.0` | Codex |
| P-014 | 2026-02-14 | v0.1.1 | Parser hardening | Hardened Investing live parser against HTML quoting/attribute-order/event-cell drift and added regression tests | Completed | `src/server/sources/investing.ts`, `tests/sourceAdapters.test.ts` | Codex |
| P-015 | 2026-02-14 | v0.1.1 | QA hardening | Added TradingView normalization drift tests and orchestrator fallback assertions for live-empty weekday responses | Completed | `src/server/sources/tradingview.ts`, `tests/sourceAdapters.test.ts`, `tests/orchestrator.test.ts` | Codex |
| P-016 | 2026-02-14 | v0.1.1 | CI diagnostics | Added JUnit test report artifacts for unit/snapshot jobs in CI workflows | Completed | `.github/workflows/ci.yml`, `.github/workflows/build-image.yml`, `package.json` | Codex |
| P-017 | 2026-02-14 | v0.1.1 | Fixture-first QA | Migrated parser drift checks to dedicated fixture files for Investing and TradingView adapters | Completed | `tests/fixtures/sources/*`, `tests/sourceAdapters.test.ts` | Codex |
| P-018 | 2026-02-14 | v0.1.1 | Error-path QA | Added deterministic orchestrator test for partial live-source failure with continued valid rendering from healthy source | Completed | `tests/orchestrator.test.ts` | Codex |
| P-019 | 2026-02-14 | v0.1.1 | Release prep | Added release draft/checklist and dedicated `verify:release` command for final gate execution | Completed | `docs/V0_1_1_RELEASE_DRAFT.md`, `package.json` | Codex |
| P-020 | 2026-02-14 | v0.1.1 | CI release gate | Added manual GitHub workflow to run Node-20 release verification on target refs | Completed | `.github/workflows/release-gate.yml` | Codex |
| P-021 | 2026-02-14 | v0.1.1 | Repo hygiene | Added troubleshooting policy for `next-env.d.ts` route-import drift and reset procedure | Completed | `docs/TROUBLESHOOTING.md` | Codex |
| P-022 | 2026-02-14 | v0.1.1 | Release automation | Enabled release-gate workflow auto-run on pushes to `main` in addition to manual dispatch | Completed | `.github/workflows/release-gate.yml` | Codex |
| P-023 | 2026-02-14 | v0.1.1 | Smoke automation | Added deterministic API smoke script for weekly/ICS endpoint gate checks | Completed | `scripts/smoke_api.sh`, `docs/V0_1_1_RELEASE_DRAFT.md` | Codex |
| P-024 | 2026-02-14 | v0.1.1 | CI smoke gate | Extended `Release Gate` workflow to start app and execute smoke API checks with log artifacts | Completed | `.github/workflows/release-gate.yml`, `scripts/smoke_api.sh` | Codex |
| P-025 | 2026-02-14 | v0.1.1 | Release evidence | Added structured evidence template for final gate closure and tag readiness | Completed | `docs/V0_1_1_EVIDENCE.md` | Codex |
| P-026 | 2026-02-14 | v0.1.1 | Gate evidence | Recorded successful local Node-20 `verify:release` evidence (`92/92` tests) | Completed | `docs/V0_1_1_EVIDENCE.md` | Codex |
| P-027 | 2026-02-14 | v0.1.1 | Gate traceability | Release Gate workflow now auto-commits a success marker JSON on pass | Completed | `.github/workflows/release-gate.yml`, `docs/release-gate-last-success.json` | Codex |
| P-028 | 2026-02-14 | v0.1.1 | Gate validation | Added deterministic local validator for release-gate marker (`status=success` and `sha == HEAD`) | Completed | `scripts/check_release_gate.sh`, `package.json`, `docs/V0_1_1_EVIDENCE.md` | Codex |
| P-029 | 2026-02-14 | v0.1.1 | CI hardening | Added retry logic for `npm ci` and extended app readiness wait in Release Gate workflow | Completed | `.github/workflows/release-gate.yml` | Codex |
| P-030 | 2026-02-14 | v0.1.1 | CI dependency stability | Pinned CI/Docker installs to `npm ci --legacy-peer-deps` to avoid peer-resolution flakiness in Release Gate | Completed | `.github/workflows/*.yml`, `Dockerfile` | Codex |
| P-031 | 2026-02-14 | v0.1.1 | CI robustness | Added dual-registry install fallback and pinned Node `20.20.0` in all workflows; improved release-gate smoke startup diagnostics | Completed | `.github/workflows/*.yml` | Codex |
| P-032 | 2026-02-14 | v0.1.1 | Gate observability | Added per-step outcomes (`install`/`verify`/`smoke`) to release-gate marker for deterministic failure diagnosis | Completed | `.github/workflows/release-gate.yml`, `docs/release-gate-last-success.json` | Codex |
| P-033 | 2026-02-14 | v0.1.1 | Smoke stability | Hardened `scripts/smoke_api.sh` content-type validation and added response diagnostics for faster gate-failure triage | Completed | `scripts/smoke_api.sh` | Codex |
| P-034 | 2026-02-14 | v0.1.1 | Marker reliability | Replaced marker auto-commit action with explicit git commit/push retries and added smoke log tail to marker JSON | Completed | `.github/workflows/release-gate.yml`, `docs/V0_1_1_EVIDENCE.md` | Codex |
| P-035 | 2026-02-14 | v0.1.1 | Smoke runtime fix | Switched Release Gate startup from `next start` to `node .next/standalone/server.js` for standalone builds | Completed | `.github/workflows/release-gate.yml` | Codex |
| P-036 | 2026-02-14 | v0.1.1 | Smoke diagnostics | Persisted smoke-script output (`/tmp/release-gate-smoke.log`) to artifacts and marker (`smoke_check_tail_b64`) | Completed | `.github/workflows/release-gate.yml`, `docs/V0_1_1_EVIDENCE.md` | Codex |
| P-037 | 2026-02-14 | v0.1.1 | Marker race fix | Marker commit is now gated to current `origin/main` HEAD to prevent stale-run overwrites and commit conflicts | Completed | `.github/workflows/release-gate.yml` | Codex |
| P-038 | 2026-02-14 | v0.1.1 | Smoke permission fix | Execute smoke script via `bash` in Release Gate to avoid executable-bit drift across environments | Completed | `.github/workflows/release-gate.yml` | Codex |
| P-039 | 2026-02-14 | v0.1.1 | Smoke ICS rule fix | Smoke check now validates `CATEGORIES:Wirtschafts-Event` per existing VEVENT instead of failing on event-empty calendars | Completed | `scripts/smoke_api.sh` | Codex |
| P-040 | 2026-02-15 | v0.1.1 | Gate check fix | `check:release-gate` now accepts successful run SHA on `HEAD^` when `HEAD` is the marker commit | Completed | `scripts/check_release_gate.sh`, `docs/V0_1_1_EVIDENCE.md` | Codex |
| P-041 | 2026-02-15 | v0.1.1 | Release publish | Finalized release documentation and published tag `v0.1.1` on `origin` | Completed | `docs/RELEASES.md`, `docs/V0_1_1_EVIDENCE.md`, tag `v0.1.1` | Codex |
| P-042 | 2026-02-15 | v0.1.2 | Planning | Created `v0.1.2` planning doc with scope, risks, workstreams, backlog, and DoD | Completed | `docs/V0_1_2_PLAN.md` | Codex |
| P-043 | 2026-02-15 | v0.1.2 | UI foundation | Refactored `src/app/page.tsx` into deterministic UI state model with strict-output isolation and scope-bound actions | Completed | `src/app/page.tsx`, `src/app/globals.css` | Codex |
| P-044 | 2026-02-15 | v0.1.2 | Scope-state determinism | Added pure scope-state helpers and dedicated unit tests for query/storage precedence and canonical region ordering | Completed | `src/app/scopeState.ts`, `tests/scopeState.ui.test.ts` | Codex |
| P-045 | 2026-02-15 | v0.1.2 | UI contract tests | Added markup-level UI/a11y contract tests and strengthened form semantics (`fieldset/legend`, stable ids, alert/live regions) | Completed | `tests/page.ui.contract.test.ts`, `src/app/page.tsx` | Codex |
| P-046 | 2026-02-15 | v0.1.2 | Release prep | Created `v0.1.2` release draft and evidence templates for gate closure and publish flow | Completed | `docs/V0_1_2_RELEASE_DRAFT.md`, `docs/V0_1_2_EVIDENCE.md` | Codex |
| P-047 | 2026-02-15 | v0.1.2 | Request helpers | Extracted UI request endpoint builders and added deterministic tests for `regions`-primary query contract | Completed | `src/app/uiRequests.ts`, `tests/uiRequests.test.ts`, `src/app/page.tsx` | Codex |
| P-048 | 2026-02-15 | v0.1.2 | Node20 gate proof | Completed full Node-20 `verify:release` locally with `TMPDIR=/tmp` workaround; all checks green (`105/105`) | Completed | `docs/V0_1_2_EVIDENCE.md` | Codex |
| P-049 | 2026-02-15 | v0.1.2 | Gate closure | Synced latest release-gate marker and closed `v0.1.2` gate evidence (`run_id=22034113407`) | Completed | `docs/release-gate-last-success.json`, `docs/V0_1_2_EVIDENCE.md` | Codex |
| P-050 | 2026-02-15 | v0.1.2 | Release publish | Published `v0.1.2` tag and finalized release records | Completed | tag `v0.1.2`, `docs/RELEASES.md`, `docs/V0_1_2_RELEASE_DRAFT.md` | Codex |
| P-051 | 2026-02-15 | v0.1.3 | Planning | Started `v0.1.3` operational hardening plan (scope, risks, workstreams, DoD) | Completed | `docs/V0_1_3_PLAN.md` | Codex |
| P-052 | 2026-02-15 | v0.1.3 | Release scaffold | Added release draft/evidence templates and next-release references | Completed | `docs/V0_1_3_RELEASE_DRAFT.md`, `docs/V0_1_3_EVIDENCE.md`, `docs/RELEASES.md` | Codex |
| P-053 | 2026-02-15 | v0.1.3 | Runtime alignment | Aligned `npm start` with standalone Next runtime to match CI smoke startup path | Completed | `package.json`, `docs/V0_1_3_PLAN.md` | Codex |
| P-054 | 2026-02-15 | v0.1.3 | Contract tests | Expanded route-level `regions`/`countries` normalization conflict tests for weekly and ICS APIs | Completed | `tests/api.weekly.route.test.ts`, `tests/api.weekly-ics.route.test.ts` | Codex |
| P-055 | 2026-02-15 | v0.1.3 | Fallback contract tests | Added strict live-failure fallback rendering assertions (Mo-Fr headers, note-only lines, no events) and re-verified gates | Completed | `tests/orchestrator.test.ts`, `npm run verify:release` | Codex |
| P-056 | 2026-02-15 | v0.1.3 | Gate closure | Refreshed release-gate marker and closed `V-303` evidence for current HEAD | Completed | `docs/release-gate-last-success.json`, `docs/V0_1_3_EVIDENCE.md` | Codex |
| P-057 | 2026-02-15 | v0.1.3 | Release publish | Published `v0.1.3` tag and finalized release records | Completed | tag `v0.1.3`, `docs/RELEASES.md`, `docs/V0_1_3_RELEASE_DRAFT.md` | Codex |
| P-058 | 2026-02-15 | v0.1.4 | Planning | Created `v0.1.4` plan/scope with guardrails, risks, and executable task backlog | Completed | `docs/V0_1_4_PLAN.md` | Codex |
| P-059 | 2026-02-15 | v0.1.4 | Release scaffold | Added `v0.1.4` release draft and evidence templates | Completed | `docs/V0_1_4_RELEASE_DRAFT.md`, `docs/V0_1_4_EVIDENCE.md` | Codex |
| P-060 | 2026-02-15 | v0.1.4 | Baseline gate refresh | Re-ran Node-20 verify and validated release-gate marker for current baseline | Completed | `npm run verify:release`, `npm run check:release-gate` | Codex |
| P-061 | 2026-02-15 | v0.1.4 | Contract coverage | Added additional deprecated-alias normalization route tests and re-verified full suite | Completed | `tests/api.weekly.route.test.ts`, `tests/api.weekly-ics.route.test.ts` | Codex |
| P-062 | 2026-02-15 | v0.1.4 | Gate closure | Validated release-candidate marker (`run_id=22035048334`) and closed `V-404` | Completed | `docs/release-gate-last-success.json`, `docs/V0_1_4_EVIDENCE.md` | Codex |
| P-063 | 2026-02-15 | v0.1.4 | Release publish | Published `v0.1.4` tag and finalized release records | Completed | tag `v0.1.4`, `docs/RELEASES.md`, `docs/V0_1_4_RELEASE_DRAFT.md` | Codex |
| P-064 | 2026-02-15 | v0.1.5 | Planning | Created `v0.1.5` plan with scope, guardrails, workstreams, risks, and backlog (`V-501`..`V-505`) | Completed | `docs/V0_1_5_PLAN.md` | Codex |
| P-065 | 2026-02-15 | v0.1.5 | Release scaffold | Added `v0.1.5` release draft and evidence templates for deterministic gate closure | Completed | `docs/V0_1_5_RELEASE_DRAFT.md`, `docs/V0_1_5_EVIDENCE.md` | Codex |
| P-066 | 2026-02-15 | v0.1.5 | Baseline gate | Completed `V-501` baseline sync + Node-20 verify + release-gate marker validation (`run_id=22035278347`) | Completed | `docs/V0_1_5_PLAN.md`, `docs/V0_1_5_EVIDENCE.md` | Codex |
| P-067 | 2026-02-15 | v0.1.5 | Adapter resilience | Completed `V-502` with deterministic live-fetch timeout handling and TradingView epoch timestamp parsing + tests | Completed | `src/server/sources/common.ts`, `src/server/sources/investing.ts`, `src/server/sources/tradingview.ts`, `tests/sourceAdapters.test.ts` | Codex |
| P-068 | 2026-02-15 | v0.1.5 | Coverage expansion | Completed `V-503` with deterministic timeout utility tests and source-adapter regression matrix expansion (`115/115`) | Completed | `tests/sourceCommon.test.ts`, `tests/sourceAdapters.test.ts`, `docs/V0_1_5_PLAN.md` | Codex |
| P-069 | 2026-02-15 | v0.1.5 | Gate diagnostics | Completed `V-504` by hardening release-gate diagnostics (run_id, step outcomes, decoded smoke tails) in marker checks | Completed | `scripts/check_release_gate.sh`, `docs/V0_1_5_PLAN.md` | Codex |
| P-070 | 2026-02-15 | v0.1.5 | Gate closure | Validated release-candidate marker (`run_id=22035467485`) and closed `V-505` | Completed | `docs/release-gate-last-success.json`, `docs/V0_1_5_EVIDENCE.md` | Codex |
| P-071 | 2026-02-15 | v0.1.5 | Release publish | Published `v0.1.5` tag and finalized release records | Completed | tag `v0.1.5`, `docs/RELEASES.md`, `docs/V0_1_5_RELEASE_DRAFT.md` | Codex |
| P-072 | 2026-02-15 | v0.1.6 | Planning | Created `v0.1.6` plan with scope, guardrails, workstreams, risks, and backlog (`V-601`..`V-605`) | Completed | `docs/V0_1_6_PLAN.md` | Codex |
| P-073 | 2026-02-15 | v0.1.6 | Release scaffold | Added `v0.1.6` release draft and evidence templates for deterministic gate closure | Completed | `docs/V0_1_6_RELEASE_DRAFT.md`, `docs/V0_1_6_EVIDENCE.md` | Codex |
| P-074 | 2026-02-15 | v0.1.6 | Baseline gate | Completed `V-601` baseline sync + Node-20 verify + release-gate marker validation (`run_id=22035703265`) | Completed | `docs/V0_1_6_PLAN.md`, `docs/V0_1_6_EVIDENCE.md` | Codex |
| P-075 | 2026-02-15 | v0.1.6 | Contract-proofing | Completed `V-602` by hardening canonical fallback note-line tests without snapshot drift | Completed | `tests/rendererFallbacks.test.ts`, `docs/V0_1_6_PLAN.md` | Codex |
| P-076 | 2026-02-15 | v0.1.6 | Operability | Completed `V-603` with release-gate marker mismatch runbook hardening | Completed | `docs/TROUBLESHOOTING.md`, `docs/V0_1_6_PLAN.md` | Codex |
| P-077 | 2026-02-15 | v0.1.6 | Gate rerun | Completed `V-604` by re-running full deterministic gates post-hardening (`115/115`) | Completed | `npm run verify:release`, `docs/V0_1_6_EVIDENCE.md` | Codex |
| P-078 | 2026-02-15 | v0.1.6 | Gate closure | Validated release-candidate marker (`run_id=22035813418`) and closed `V-605` | Completed | `docs/release-gate-last-success.json`, `docs/V0_1_6_EVIDENCE.md` | Codex |
| P-079 | 2026-02-15 | v0.1.6 | Release publish | Published `v0.1.6` tag and finalized release records | Completed | tag `v0.1.6`, `docs/RELEASES.md`, `docs/V0_1_6_RELEASE_DRAFT.md` | Codex |
| P-080 | 2026-02-15 | Tooling | Hardening | Added deterministic `next-env.d.ts` drift guard (`check/fix` scripts, CI check, optional pre-commit hook) without runtime logic changes | Completed | `scripts/check_next_env.sh`, `scripts/normalize_next_env.sh`, `.github/workflows/*.yml`, `npm run verify:release` | Codex |
| P-081 | 2026-02-15 | UI Execution | Documentation | Added deterministic UI execution checklist/report artifacts for repeatable runtime validation and evidence capture | Completed | `docs/UI_EXECUTION_CHECKLIST.md`, `docs/UI_EXECUTION_REPORT.md` | Codex |
| P-082 | 2026-02-15 | UI Execution | Evidence | Executed fixtures-mode runtime checks and full Node-20 deterministic verify; documented EACCES temp-path workaround (`TMPDIR=/tmp`) | Completed | `docs/UI_EXECUTION_REPORT.md`, `npm run verify` | Codex |
| P-083 | 2026-02-15 | UI QA | Contract hardening | Added UI contract assertion that meta/debug state stays outside strict `<pre>` before generation | Completed | `tests/page.ui.contract.test.ts` | Codex |
| P-084 | 2026-02-15 | UI QA | Generate-flow hardening | Added pure weekly-response normalizer and UI tests for malformed/missing meta handling without strict-output drift | Completed | `src/app/weeklyResponse.ts`, `tests/weeklyResponse.ui.test.ts`, `src/app/page.tsx` | Codex |
| P-085 | 2026-02-15 | UI QA | Persistence hardening | Extracted deterministic `regions` query builder preserving unrelated params and covered empty/non-empty serialization paths | Completed | `src/app/scopeState.ts`, `tests/scopeState.ui.test.ts`, `src/app/page.tsx` | Codex |
| P-086 | 2026-02-15 | UI QA | Metadata hardening | Dedupe-normalized `sourcesUsed` in UI response parser and re-verified full deterministic gate suite (`121/121`) | Completed | `src/app/weeklyResponse.ts`, `tests/weeklyResponse.ui.test.ts`, `npm run verify` | Codex |
| P-087 | 2026-02-15 | UI QA | Action-state hardening | Extracted pure UI action/error state helpers and expanded UI helper tests; re-verified full deterministic gate suite (`125/125`) | Completed | `src/app/uiState.ts`, `tests/uiState.ui.test.ts`, `src/app/page.tsx`, `npm run verify` | Codex |
| P-088 | 2026-02-15 | Process | Reuse hardening | Added reusable `spec-safe-direct-delivery` skill and direct-path rule in contributing guide for project-overarching accelerated delivery | Completed | `skills/spec-safe-direct-delivery/*`, `CONTRIBUTING.md` | Codex |
| P-089 | 2026-02-15 | Release Gate | Smoke hardening | Extended smoke script to validate UI shell contract in addition to weekly/ICS API checks for tighter end-to-end gate coverage | Completed | `scripts/smoke_api.sh`, `docs/UI_EXECUTION_CHECKLIST.md` | Codex |
| P-090 | 2026-02-15 | Process | Automation reuse | Extended direct-delivery skill with cross-project adoption guidance and an executable cycle script for deterministic batch verify/push/gate closure | Completed | `skills/spec-safe-direct-delivery/SKILL.md`, `skills/spec-safe-direct-delivery/references/direct-path-cycle.md`, `skills/spec-safe-direct-delivery/scripts/run_direct_cycle.sh`, `CONTRIBUTING.md` | Codex |
| P-091 | 2026-02-15 | Release Gate | Weekly payload hardening | Hardened smoke weekly validation with strict header check plus `meta.sourceMode` and `meta.sourcesUsed` semantic assertions | Completed | `scripts/smoke_api.sh`, `docs/UI_EXECUTION_CHECKLIST.md` | Codex |
| P-092 | 2026-02-15 | Release Gate | Strict-output invariants | Hardened smoke weekly validation to enforce no links in strict text and exactly five day headers (`###`) | Completed | `scripts/smoke_api.sh`, `docs/UI_EXECUTION_CHECKLIST.md` | Codex |
| P-093 | 2026-02-15 | Release Gate | Mode explicitness | Set release-gate smoke invocation to pass `fixtures` expected source mode explicitly (no implicit default reliance) | Completed | `.github/workflows/release-gate.yml` | Codex |
| P-094 | 2026-02-15 | Release Gate | Canonical line invariants | Hardened smoke weekly validation with allowed Hinweis whitelist and exact ` - **TOP-EVENT**` suffix enforcement | Completed | `scripts/smoke_api.sh`, `docs/UI_EXECUTION_CHECKLIST.md` | Codex |
| P-095 | 2026-02-15 | Release Gate | ICS header invariants | Hardened smoke ICS validation with required attachment filename pattern `Wochenausblick_YYYY-MM-DD.ics` | Completed | `scripts/smoke_api.sh`, `docs/UI_EXECUTION_CHECKLIST.md` | Codex |
| P-096 | 2026-02-15 | Release Gate | Strict format invariants | Hardened smoke weekly validation with header-date regex and event-line pattern checks | Completed | `scripts/smoke_api.sh`, `docs/UI_EXECUTION_CHECKLIST.md` | Codex |
| P-097 | 2026-02-15 | UI Resilience | Storage safety | Added safe localStorage wrappers with deterministic fallback semantics and integrated them into UI state boot/persist flow (`129/129`) | Completed | `src/app/storageSafe.ts`, `src/app/page.tsx`, `tests/storageSafe.ui.test.ts`, `npm run verify` | Codex |
| P-098 | 2026-02-15 | v0.1.7 | Planning | Created `v0.1.7` plan with guardrails, scope, workstreams, risks, and execution backlog (`V-701`..`V-705`) | Completed | `docs/V0_1_7_PLAN.md` | Codex |
| P-099 | 2026-02-15 | v0.1.7 | Release scaffold | Added `v0.1.7` release draft and evidence scaffold for deterministic gate closure | Completed | `docs/V0_1_7_RELEASE_DRAFT.md`, `docs/V0_1_7_EVIDENCE.md` | Codex |
| P-100 | 2026-02-15 | Release Docs | Planning traceability | Registered `v0.1.7` as planned upcoming release in release ledger | Completed | `docs/RELEASES.md` | Codex |
| P-101 | 2026-02-15 | v0.1.7 | Baseline gate | Completed `V-701` baseline sync + Node-20 verify + release-gate marker validation (`run_id=22038326822`) | Completed | `docs/V0_1_7_PLAN.md`, `docs/V0_1_7_EVIDENCE.md` | Codex |
| P-102 | 2026-02-15 | v0.1.7 | UI hardening | Completed `V-702` by enforcing deterministic sorted `meta.sourcesUsed` rendering order and adding regression coverage (`130/130`) | Completed | `src/app/weeklyResponse.ts`, `tests/weeklyResponse.ui.test.ts`, `docs/V0_1_7_PLAN.md` | Codex |
| P-103 | 2026-02-15 | v0.1.7 | UI edge coverage | Completed `V-703` by normalizing non-API UI error messages to stable deterministic values with regression tests | Completed | `src/app/uiState.ts`, `tests/uiState.ui.test.ts`, `docs/V0_1_7_PLAN.md` | Codex |
| P-104 | 2026-02-15 | v0.1.7 | Gate rerun | Completed `V-704` by re-running deterministic verify and validating release-gate marker on hardened commit (`run_id=22038553850`) | Completed | `docs/V0_1_7_PLAN.md`, `docs/V0_1_7_EVIDENCE.md` | Codex |
| P-105 | 2026-02-15 | v0.1.7 | Release publish | Completed `V-705` by finalizing release evidence and publishing tag `v0.1.7` on `f2010a0` | Completed | `docs/V0_1_7_EVIDENCE.md`, `docs/RELEASES.md`, tag `v0.1.7` | Codex |
| P-106 | 2026-02-15 | ICS | Bug fix | Fixed Outlook subject context by prepending fixed region label to ICS `SUMMARY` | Completed | `src/core/icsSerializer.ts`, `tests/icsSerializer.test.ts`, `tests/fixtures/golden/ics_single_event.ics` | Codex |
| P-107 | 2026-02-15 | Scope | Bug fix | Enforced selected `regions` scope in orchestrator before strict rendering and ICS generation | Completed | `src/server/orchestrator.ts`, `tests/orchestrator.test.ts` | Codex |
| P-108 | 2026-02-15 | Release Gate | Smoke hardening | Extended smoke checks to enforce selected-region scope in strict output lines and ICS summaries | Completed | `scripts/smoke_api.sh`, `docs/UI_EXECUTION_CHECKLIST.md` | Codex |
| P-109 | 2026-02-15 | Dev tooling | Drift hardening | Wrapped `dev:live`/`dev:fixtures` with auto-normalization of `next-env.d.ts` on process exit | Completed | `scripts/dev_live.sh`, `scripts/dev_fixtures.sh`, `README.md`, `docs/TROUBLESHOOTING.md` | Codex |
| P-110 | 2026-02-15 | Governance | Process hardening | Added sprint mitigation gates (DoR/DoD/security/cycle efficiency) in rules and skills | Completed | `RULES.md`, `skills/spec-safe-direct-delivery/*`, `skills/deterministic-qa-harness/SKILL.md` | Codex |
| P-111 | 2026-02-15 | Windows Ops | Launcher feature | Added one-click desktop launcher flow (PowerShell + BAT + shortcut installer) | Completed | `scripts/windows/start_app_desktop.ps1`, `scripts/windows/start_app_desktop.bat`, `scripts/windows/install_desktop_shortcut.ps1` | Codex |
| P-112 | 2026-02-15 | Windows Ops | Launcher hardening | Added browser-open fallback chain and robust readiness handling | Completed | `scripts/windows/start_app_desktop.ps1`, `README.md` | Codex |
| P-113 | 2026-02-15 | Windows Ops | Bug fix | Fixed PowerShell variable collision (`Host` -> `AppHost`) in launcher | Completed | `scripts/windows/start_app_desktop.ps1` | Codex |
| P-114 | 2026-02-15 | Windows Ops | Bug fix | Fixed WSL path conversion with resilient fallback mapping (`/mnt/<drive>/...`) | Completed | `scripts/windows/start_app_desktop.ps1` | Codex |
| P-115 | 2026-02-15 | Documentation | Consolidation | Closed docs to a clean sprint handoff baseline for next scope | Completed | `docs/QA_STATUS.md`, `docs/UI_EXECUTION_REPORT.md`, `docs/NEXT_SPRINT_HANDOFF.md`, `README.md` | Codex |
| P-116 | 2026-02-17 | UI | Feature | Added dual-view economic calendar table with fixed columns and weekday grouping (`Date + Time | Currency | Event | Importance | Actual | Forecast | Previous`) | Completed | `src/app/page.tsx`, `src/app/calendarTable.ts`, `tests/calendarTable.ui.test.ts` | Codex |
| P-117 | 2026-02-17 | Strict Output | Contract update | Updated strict header to date-range-only format and added canonical `All Day:` event line support | Completed | `src/core/rendererStrictDe.ts`, `tests/rendererStrictDe.test.ts`, `tests/fixtures/golden/*.txt` | Codex |
| P-118 | 2026-02-17 | ICS | Feature | Added deterministic metrics `DESCRIPTION` lines and all-day `VALUE=DATE` serialization while preserving RFC5545/Outlook constraints | Completed | `src/core/icsSerializer.ts`, `tests/icsSerializer.test.ts`, `tests/fixtures/golden/ics_single_event.ics` | Codex |
| P-119 | 2026-02-17 | Sources | Feature | Extended source parsing for `All Day`, `importance`, `actual/forecast/previous` and removed Investing `timeFilter=timeOnly` restriction | Completed | `src/server/sources/investing.ts`, `src/server/sources/tradingview.ts`, `tests/sourceAdapters.test.ts` | Codex |
| P-120 | 2026-02-17 | Governance | Contract patch | Applied RULES/Plan/Skills updates for UI Update sprint, incl. no-hallucination metrics and all-day governance | Completed | `RULES.md`, `docs/IMPLEMENTATION_PLAN.md`, `skills/*` | Codex |
| P-121 | 2026-02-17 | Planning | Gate package | Added next-iteration planning-gate skill, generated `v0.1.8` plan, and recorded planning evidence (no code phase) | Completed | `skills/ui-update-next-iteration-planning-gate/*`, `docs/V0_1_8_PLAN.md`, `docs/V0_1_8_EVIDENCE.md` | Codex |
| P-122 | 2026-02-17 | UI/API | Feature slice | Implemented strict-output visibility toggle (`default off`), deterministic TOP/importance equivalence, and ICS importance export filtering with targeted + full verify gates | Completed | `src/app/page.tsx`, `src/app/uiRequests.ts`, `src/app/api/weekly.ics/route.ts`, `src/server/orchestrator.ts`, `tests/*`, `docs/V0_1_8_EVIDENCE.md` | Codex |
| P-123 | 2026-02-17 | CI | Gate closure | Fixed smoke UI assertion for strict-toggle default and closed release gate for `v0.1.8` head | Completed | `scripts/smoke_api.sh`, `docs/release-gate-last-success.json`, `docs/V0_1_8_EVIDENCE.md` | Codex |
| P-124 | 2026-02-17 | Planning | Option-C widget plan | Added Windows desktop widget Option-C strategy, feed/settings contracts, split delivery playbook, and modular widget skills | Completed | `docs/WIDGET_IMPLEMENTATION_PLAN.md`, `docs/WIDGET_FEED_CONTRACT.md`, `docs/WIDGET_SETTINGS_CONTRACT.md`, `docs/WIDGET_SPLIT_DELIVERY_PLAYBOOK.md`, `skills/widget-*` | Codex |
| P-125 | 2026-02-17 | Planning | Widget style alignment | Imported widget style guide and aligned contracts/skills with adopted UI rules and consumer query profile | Completed | `docs/WIDGET_STYLE_GUIDE.md`, `docs/WIDGET_STYLE_GUIDE_ALIGNMENT.md`, `docs/WIDGET_FEED_CONTRACT.md`, `docs/WIDGET_SETTINGS_CONTRACT.md`, `docs/WIDGET_IMPLEMENTATION_PLAN.md`, `skills/widget-*` | Codex |
| P-126 | 2026-02-17 | Planning | Widget execution readiness | Added execution checklist and advanced handoff queue from contract freeze to implementation-ready gates | Completed | `docs/WIDGET_EXECUTION_CHECKLIST.md`, `docs/NEXT_SPRINT_HANDOFF.md` | Codex |
| P-127 | 2026-02-17 | Planning | Widget boundary baseline | Added explicit project-boundary and CI-baseline contract for separated desktop widget project | Completed | `docs/WIDGET_PROJECT_BOUNDARY.md`, `docs/NEXT_SPRINT_HANDOFF.md` | Codex |
| P-128 | 2026-02-17 | Planning | Widget E2 integration prep | Added provider-side feed integration test plan and evidence template for deterministic E2 gate closure | Completed | `docs/WIDGET_E2_FEED_INTEGRATION_PLAN.md`, `docs/WIDGET_E2_EVIDENCE.md`, `docs/NEXT_SPRINT_HANDOFF.md` | Codex |
| P-129 | 2026-02-17 | API/QA | Widget feed E2 slice | Implemented `GET /api/widget-feed` and added provider-side contract route tests with deterministic E2 evidence | Completed | `src/app/api/widget-feed/route.ts`, `src/server/widgetFeed.ts`, `tests/api.widget-feed.route.test.ts`, `docs/WIDGET_E2_EVIDENCE.md` | Codex |
| P-130 | 2026-02-17 | UI | Widget E3 slice | Added widget-preview vertical slice (bar, ticker lane, settings basics, handle mode) with targeted contract tests | Completed | `src/app/widget-preview/page.tsx`, `src/app/widgetPreviewClient.ts`, `tests/widgetPreviewClient.test.ts`, `docs/WIDGET_E3_EVIDENCE.md` | Codex |
| P-131 | 2026-02-17 | CI | Widget baseline gates | Added explicit widget-feed contract test script and CI gate step for execution baseline closure | Completed | `package.json`, `.github/workflows/ci.yml` | Codex |
| P-132 | 2026-02-17 | QA | Widget E2-E3 transition | Added consolidated transition evidence and released next-step handoff to desktop runtime scaffold | Completed | `docs/WIDGET_E2_E3_TRANSITION.md`, `docs/NEXT_SPRINT_HANDOFF.md` | Codex |
| P-133 | 2026-02-17 | Scaffold | Separated runtime start | Created `widget-runtime/` scaffold docs to start Option-C desktop runtime in isolated project space | Completed | `widget-runtime/README.md`, `widget-runtime/docs/SCOPING.md`, `widget-runtime/docs/EXECUTION_GATE.md` | Codex |
| P-134 | 2026-02-17 | Scaffold | Runtime release evidence wire-up | Added release-gate evidence template for separated runtime project handoff | Completed | `widget-runtime/docs/RELEASE_GATE_EVIDENCE.md`, `docs/NEXT_SPRINT_HANDOFF.md` | Codex |

## 5. Open Items
| ID | Task | Priority | Status | Blocker | Target Date | Owner |
|---|---|---|---|---|---|---|
| T-101 | Start `v0.1.1` parser/fixture hardening stream | High | Completed | None | 2026-02-14 | Codex |
| T-102 | Add deterministic metadata/error taxonomy tests for fallback behavior | High | Completed | None | 2026-02-14 | Codex |
| T-103 | Final Node-20 verify for `v0.1.1` and release tag | High | Completed | None | 2026-02-14 | Codex/User |
| T-104 | Run GitHub `Release Gate` workflow on `main` and archive artifacts | High | Completed | None | 2026-02-15 | Codex/User |
| U-201 | Implement v0.1.2 UI page shell and state model | High | Completed | None | 2026-02-15 | Codex |
| U-202 | Implement region checkbox UX (`Alle`/`Keine`) with stable serialization | High | Completed | None | 2026-02-15 | Codex |
| U-203 | Implement URL + localStorage scope persistence | High | Completed | None | 2026-02-15 | Codex |
| U-204 | Implement weekly generate flow + strict `<pre>` output isolation | High | Completed | None | 2026-02-15 | Codex |
| U-205 | Implement ICS download UX flow | Medium | Completed | None | 2026-02-15 | Codex |
| U-206 | Add UI interaction/a11y tests (fixture-first) | High | Completed | None | 2026-02-15 | Codex |
| U-207 | Run release gates + finalize `v0.1.2` evidence docs | High | Completed | None | 2026-02-15 | Codex/User |
| V-301 | Align build/runtime execution docs and scripts for `v0.1.3` | High | Completed | None | 2026-02-16 | Codex |
| V-302 | Expand SPEC-safe fallback and query-contract test coverage for `v0.1.3` | High | Completed | None | 2026-02-16 | Codex |
| V-303 | Finalize `v0.1.3` release evidence and gate pass | High | Completed | None | 2026-02-16 | Codex/User |
| V-401 | Re-run baseline verify and release-gate checks for `v0.1.4` | High | Completed | None | 2026-02-16 | Codex |
| V-402 | Publish and link `v0.1.4` planning/release scaffolding docs | High | Completed | None | 2026-02-16 | Codex |
| V-403 | Expand SPEC-safe fallback/contract coverage for `v0.1.4` | High | Completed | None | 2026-02-16 | Codex |
| V-404 | Finalize `v0.1.4` release evidence and gate pass | High | Completed | None | 2026-02-16 | Codex/User |
| V-501 | Re-run baseline verify and release-gate checks for `v0.1.5` start | High | Completed | None | 2026-02-16 | Codex/User |
| V-502 | Implement SPEC-safe live adapter resilience hardening | High | Completed | None | 2026-02-16 | Codex |
| V-503 | Expand deterministic fixture and API contract coverage for `v0.1.5` | High | Completed | None | 2026-02-16 | Codex |
| V-504 | Harden release-gate diagnostics and marker traceability | High | Completed | None | 2026-02-16 | Codex |
| V-505 | Finalize `v0.1.5` release evidence and publish tag | High | Completed | None | 2026-02-16 | Codex/User |
| V-601 | Re-run baseline verify and release-gate checks for `v0.1.6` start | High | Completed | None | 2026-02-16 | Codex/User |
| V-602 | Expand SPEC-safe contract-proofing tests | High | Completed | None | 2026-02-16 | Codex |
| V-603 | Harden release-operability diagnostics and runbook references | High | Completed | None | 2026-02-16 | Codex |
| V-604 | Re-run full deterministic gates after hardening | High | Completed | None | 2026-02-16 | Codex/User |
| V-605 | Finalize `v0.1.6` release evidence and publish tag | High | Completed | None | 2026-02-16 | Codex/User |
| V-701 | Re-run baseline verify and release-gate checks for `v0.1.7` start | High | Completed | None | 2026-02-16 | Codex/User |
| V-702 | Implement SPEC-safe UI execution hardening slice | High | Completed | None | 2026-02-16 | Codex |
| V-703 | Expand deterministic UI execution edge coverage | High | Completed | None | 2026-02-16 | Codex |
| V-704 | Re-run full deterministic gates after hardening | High | Completed | None | 2026-02-16 | Codex/User |
| V-705 | Finalize `v0.1.7` release evidence and publish tag | High | Completed | None | 2026-02-16 | Codex/User |
| N-801 | Kick off next active scope with explicit Sprint Goal + bounded backlog (<=1-week slice set) | High | Open | None | 2026-02-16 | Codex/User |
| N-802 | Define first execution slice and regression tests before coding (DoR gate) | High | Open | None | 2026-02-16 | Codex/User |
| N-803 | Close first next-scope slice with full verify + release-gate marker + evidence update (DoD gate) | High | Open | None | 2026-02-16 | Codex/User |
| N-1001 | Approve `v0.1.8` planning gate package before code phase | High | Completed | None | 2026-02-17 | Codex/User |
| N-1002 | Implement strict-toggle + TOP/importance consistency + ICS importance filters after `GO` | High | Completed | None | 2026-02-17 | Codex |
| N-1003 | Run targeted tests, then full `verify:release` and release-gate marker validation for next iteration | High | Completed | None | 2026-02-17 | Codex/User |
| W-1101 | Freeze widget feed and settings contracts (`v1.1` / `v1`) | High | Completed | None | 2026-02-18 | Codex/User |
| W-1102 | Define widget project separation and release gates | High | Completed | None | 2026-02-18 | Codex/User |
| W-1103 | Start widget vertical slice after contract approval | High | Completed | None | 2026-02-19 | Codex/User |
| W-1104 | Initialize separated widget project boundary and CI baseline | High | Completed | None | 2026-02-19 | Codex/User |
| W-1105 | Implement provider-side widget-feed integration tests and freeze E2 evidence | High | Completed | Requires W-1104 | 2026-02-19 | Codex/User |
| W-1106 | Implement widget UI vertical slice against frozen contracts | High | Completed | Requires W-1104/W-1105 | 2026-02-20 | Codex/User |
| W-1107 | Finalize widget-project CI baseline execution gates | High | Completed | Requires W-1104 | 2026-02-20 | Codex/User |
| W-1108 | Execute widget E2->E3 transition check and refresh evidence package | High | Completed | Requires W-1106/W-1107 | 2026-02-20 | Codex/User |
| W-1109 | Start separated desktop runtime scaffold with frozen contracts | High | Completed | Requires W-1107/W-1108 | 2026-02-21 | Codex/User |
| W-1110 | Wire release-gate evidence package to separated desktop runtime repo | High | Completed | Requires W-1109 | 2026-02-21 | Codex/User |
| W-1111 | Execute first end-to-end desktop runtime smoke with fixture feed | High | Open | Requires W-1109/W-1110 | 2026-02-21 | Codex/User |
| W-1112 | Add runtime settings-persistence migration check | High | Open | Requires W-1111 | 2026-02-22 | Codex/User |
| W-1113 | Add runtime error/empty state UX checks against fixture feed | High | Open | Requires W-1111 | 2026-02-22 | Codex/User |

## 6. Risks
| ID | Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|---|
| R-001 | Source markup drift breaks parsers | High | Medium | Fixture-first parser tests + snapshots | Open |
| R-002 | Non-deterministic output regressions | High | Medium | Determinism gates + parserVersion pinning | Open |
| R-003 | Legal constraints for premium sources | Medium | Medium | Approved source registry + compliance checks | Open |

## 7. Decision Log
| ID | Date | Decision | Rationale | Impact |
|---|---|---|---|---|
| D-001 | 2026-02-08 | Replace generic startup skills with domain-specific skills | Align toolset with macro-events product workflow | Higher implementation precision |
| D-002 | 2026-02-08 | Keep legacy skills in archive folder instead of deletion | Preserve history and fallback context | Lower migration risk |
| D-003 | 2026-02-08 | Enforce hard rules for style, ICS, determinism, and governance | Prevent ambiguity in implementation and QA | Stronger consistency and testability |

## 8. Documentation Rules
1. Update snapshot and progress log on every structural change.
2. Use ISO dates (`YYYY-MM-DD`) and stable IDs (`P-`, `T-`, `R-`, `D-`).
3. For every completed item, include a concrete verification artifact.
4. Keep statuses to `Open`, `In Progress`, `Completed`, or `Blocked`.
5. Do not introduce undocumented structural changes.

## 9. Key Documents
- Rules: `RULES.md`
- Plan: `docs/IMPLEMENTATION_PLAN.md`
- Current Plan: `docs/V0_1_8_PLAN.md`
- Current Release Draft: `docs/V0_1_8_RELEASE_DRAFT.md`
- Current Release Evidence: `docs/V0_1_8_EVIDENCE.md`
- Current Widget Plan: `docs/WIDGET_IMPLEMENTATION_PLAN.md`
- Current Widget Feed Contract: `docs/WIDGET_FEED_CONTRACT.md`
- Current Widget Settings Contract: `docs/WIDGET_SETTINGS_CONTRACT.md`
- Current Widget Split Playbook: `docs/WIDGET_SPLIT_DELIVERY_PLAYBOOK.md`
- Current Widget Style Guide: `docs/WIDGET_STYLE_GUIDE.md`
- Current Widget Style Alignment: `docs/WIDGET_STYLE_GUIDE_ALIGNMENT.md`
- Current Widget Execution Checklist: `docs/WIDGET_EXECUTION_CHECKLIST.md`
- Current Widget Project Boundary: `docs/WIDGET_PROJECT_BOUNDARY.md`
- Current Widget E2 Feed Integration Plan: `docs/WIDGET_E2_FEED_INTEGRATION_PLAN.md`
- Current Widget E2 Evidence: `docs/WIDGET_E2_EVIDENCE.md`
- Current Widget E3 Evidence: `docs/WIDGET_E3_EVIDENCE.md`
- Current Widget E2-E3 Transition: `docs/WIDGET_E2_E3_TRANSITION.md`
- Previous Plan: `docs/V0_1_7_PLAN.md`
- Previous Release Draft: `docs/V0_1_7_RELEASE_DRAFT.md`
- Previous Release Evidence: `docs/V0_1_7_EVIDENCE.md`
- Older Plan: `docs/V0_1_6_PLAN.md`
- Older Release Draft: `docs/V0_1_6_RELEASE_DRAFT.md`
- Older Release Evidence: `docs/V0_1_6_EVIDENCE.md`
- Release Gate Marker: `docs/release-gate-last-success.json`
- Architecture: `ARCHITECTURE.md`
- QA Status: `docs/QA_STATUS.md`
- UI Execution Checklist: `docs/UI_EXECUTION_CHECKLIST.md`
- UI Execution Report: `docs/UI_EXECUTION_REPORT.md`
- Next Sprint Handoff: `docs/NEXT_SPRINT_HANDOFF.md`
- PR Summary: `docs/PR_SUMMARY.md`
- PR Body: `docs/PR_BODY.md`
- Merge Steps: `docs/MERGE_STEPS.md`
- Releases: `docs/RELEASES.md`
- Troubleshooting: `docs/TROUBLESHOOTING.md`
- Contributing: `CONTRIBUTING.md`
- Skills root: `skills/`

## 10. Build vs Runtime Network Requirements
- Build/Dependency path:
  - Requires npm registry access to run dependency install (`npm ci`).
  - Handled in CI or Docker build stage.
- Runtime/Data path:
  - Requires internet access for runtime source retrieval (Investing, TradingView, approved tertiary, optional Reuters with legal API access).
  - Runtime must not run `npm install`.
- Delivery model:
  - Build produces a standalone runtime image/artifact that can run without dependency-network access.

## 11. Source Mode
- Default and CI: `SOURCE_MODE=fixtures`
- One-step fixtures start:
  - `npm run dev:fixtures`
- Local live mode:
  - `npm run dev:live`
- `next-env.d.ts` drift handling in dev scripts:
  - `dev:fixtures` / `dev:live` normalize `next-env.d.ts` on process exit.

## 12. Local Verification
- Required local runtime:
  - `node >= 20.9.0` (see `.nvmrc` / `.node-version`)
- Full local quality gate:
  - `npm run verify`
- `next-env.d.ts` drift guard:
  - `npm run check:next-env`
  - `npm run fix:next-env`
  - optional local auto-fix hook: `npm run setup:hooks`

## 13. Windows Desktop One-Click Start (Live)
- Ziel:
  - Desktop-Icon anklicken -> App startet in WSL live mode -> Standardbrowser öffnet `http://127.0.0.1:3000`.
- Einmalige Einrichtung in PowerShell (Windows):
  - `powershell -ExecutionPolicy Bypass -File .\scripts\windows\install_desktop_shortcut.ps1`
- Danach Start per Desktop-Verknüpfung:
  - `Macro Events Weekly Outlook`
- Manuell ohne Shortcut:
  - `.\scripts\windows\start_app_desktop.bat`
- Technische Hinweise:
  - Nutzt WSL + Repo-Root-Pfadkonvertierung (`wslpath`).
  - Startet `npm run dev:live` (SOURCE_MODE=live) im separaten WSL-Fenster.
  - Öffnet Browser erst nach erfolgreichem Readiness-Check.
  - Fallback-Reihenfolge für Browserstart: `Start-Process URL` -> `cmd /c start` -> `explorer.exe`.

## 14. Next Sprint Kickoff
- Status:
  - `Ready`
- Required start checks:
  - `git status -sb` is clean.
  - `npm run check:next-env` is green.
  - `npm run check:release-gate` is green (or marker catches up within bounded retry).
- Execution policy:
  - one active slice at a time (WIP=1),
  - targeted tests during development,
  - one full deterministic gate at slice end.
