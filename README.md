# Project Progress and Governance

## 1. Project Context
- Project: `01_Initial_Project`
- Current objective: execute `v0.1.3` operational hardening phase on top of released `v0.1.2`.
- Single source of truth for implementation governance: this `README.md`.

## 2. Current Snapshot
Date: `2026-02-15`

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
| `v0.1.3` planning baseline | In Progress | 30% | 2026-02-15 | `docs/V0_1_3_PLAN.md` |

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
| V-303 | Finalize `v0.1.3` release evidence and gate pass | High | In Progress | Awaiting post-commit release-gate marker refresh | 2026-02-16 | Codex/User |

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
- Current Plan: `docs/V0_1_3_PLAN.md`
- Current Release Draft: `docs/V0_1_3_RELEASE_DRAFT.md`
- Current Release Evidence: `docs/V0_1_3_EVIDENCE.md`
- Previous Plan: `docs/V0_1_2_PLAN.md`
- Previous Release Draft: `docs/V0_1_2_RELEASE_DRAFT.md`
- Previous Release Evidence: `docs/V0_1_2_EVIDENCE.md`
- Older Plan: `docs/V0_1_1_PLAN.md`
- Older Release Draft: `docs/V0_1_1_RELEASE_DRAFT.md`
- Older Release Evidence: `docs/V0_1_1_EVIDENCE.md`
- Release Gate Marker: `docs/release-gate-last-success.json`
- Architecture: `ARCHITECTURE.md`
- QA Status: `docs/QA_STATUS.md`
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
- Local live mode:
  - `TZ=Europe/Berlin NODE_OPTIONS=--dns-result-order=ipv4first SOURCE_MODE=live npm run dev`

## 12. Local Verification
- Required local runtime:
  - `node >= 20.9.0` (see `.nvmrc` / `.node-version`)
- Full local quality gate:
  - `npm run verify`
