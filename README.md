# Project Progress and Governance

## 1. Project Context
- Project: `01_Initial_Project`
- Current objective: establish a domain-specific setup for the Macro Events Weekly Outlook app.
- Single source of truth for implementation governance: this `README.md`.

## 2. Current Snapshot
Date: `2026-02-14`

| Area | Status | Completion | Last Updated | Evidence |
|---|---|---:|---|---|
| Domain rules baseline | Completed | 100% | 2026-02-08 | `RULES.md` |
| Legacy startup skills archived | Completed | 100% | 2026-02-08 | `skills/_legacy-startup/*` |
| New domain skill set | Completed | 100% | 2026-02-08 | `skills/*` (new folders listed below) |
| Detailed implementation plan | Completed | 100% | 2026-02-08 | `docs/IMPLEMENTATION_PLAN.md` |
| Core/API baseline implementation | Completed | 100% | 2026-02-14 | `src/core/*`, `src/server/*`, `src/app/api/*` |
| Deterministic test harness | Completed | 100% | 2026-02-14 | `tests/*`, `tests/fixtures/golden/*` |
| CI quality gates incl. snapshot | Completed | 100% | 2026-02-14 | `.github/workflows/*.yml`, `package.json` |

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

## 5. Open Items
| ID | Task | Priority | Status | Blocker | Target Date | Owner |
|---|---|---|---|---|---|---|
| T-101 | Start `v0.1.1` parser/fixture hardening stream | High | Completed | None | 2026-02-14 | Codex |
| T-102 | Add deterministic metadata/error taxonomy tests for fallback behavior | High | Completed | None | 2026-02-14 | Codex |
| T-103 | Final Node-20 verify for `v0.1.1` and release tag | High | Completed | None | 2026-02-14 | Codex/User |
| T-104 | Run GitHub `Release Gate` workflow on `main` and archive artifacts | High | In Progress | Pending marker success for current `HEAD` (`npm run check:release-gate`) and manual artifact URL capture | 2026-02-15 | Codex/User |

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
- Next Plan: `docs/V0_1_1_PLAN.md`
- Next Release Draft: `docs/V0_1_1_RELEASE_DRAFT.md`
- Next Release Evidence: `docs/V0_1_1_EVIDENCE.md`
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
