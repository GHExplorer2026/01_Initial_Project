# V0_1_5_PLAN.md

## Goal
Deliver the `v0.1.5` hardening increment on top of released `v0.1.4`, focused on live-mode reliability, deterministic observability, and release-gate robustness without any SPEC drift.

## Release Status
1. `v0.1.5` is released.
2. Release tag: `v0.1.5` on commit `9beb641`.
3. Entry criteria:
   - `main` synced with latest release-gate marker.
   - `npm run check:release-gate` valid for current `HEAD`.

## Guardrails (Non-Negotiable)
1. No changes to canonical rules in `RULES.md`.
2. No changes to strict renderer canonical strings or formatting.
3. No changes to ICS mandatory profile (`CATEGORIES:Wirtschafts-Event`, deterministic UID/DTSTAMP, CRLF/folding, VTIMEZONE).
4. Fixture-first determinism remains default in tests/CI (`SOURCE_MODE=fixtures`).
5. `regions` remains primary API query parameter; `countries` stays deprecated alias behavior.

## In Scope
1. Plan and execute SPEC-safe parser/adapter resilience hardening for live mode.
2. Expand deterministic fixture coverage for fallback and contract-critical paths.
3. Improve release-gate diagnostics where failures are ambiguous.
4. Prepare `v0.1.5` release scaffolding and evidence flow.

## Out of Scope
1. Any UI redesign or new product feature set.
2. Any output schema changes in strict text or ICS export.
3. Any source-priority or tertiary-governance rule changes.
4. Any CI dependence on live network for test execution.

## Workstreams

## W1 Baseline Synchronization and Gate Validation
Status: Completed

1. Sync `main` and validate release marker alignment.
2. Re-run full deterministic verify gate in Node 20 baseline.
3. Record baseline evidence for `v0.1.5` start.
   Progress:
   - Synced `main` and validated marker:
     - `npm run check:release-gate` -> pass
     - `run_id=22035278347`
   - Re-ran deterministic verify gate in Node 20:
     - `TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run verify:release`
     - `111/111` tests pass

### Acceptance
1. `npm run verify:release` is green.
2. `npm run check:release-gate` is green for current baseline.

## W2 Live-Mode Adapter Hardening (SPEC-safe)
Status: Completed

1. Review live adapter failure surfaces (fetch failures, parse variance, missing-time handling).
2. Tighten adapter behavior without changing normalization contracts.
3. Keep live-mode error behavior bound to canonical fallback notes.
   Progress:
   - Added deterministic timeout handling for live-source fetches via `SOURCE_FETCH_TIMEOUT_MS` with safe default.
   - Added TradingView live parser support for epoch timestamps (seconds and milliseconds), preserving region/currency/time contracts.
   - Added adapter-level regression tests for timeout mapping and timestamp parsing.

### Acceptance
1. No strict output drift.
2. No ICS contract drift.
3. Added tests cover identified failure surfaces.

## W3 Deterministic Coverage Expansion
Status: Completed

1. Add fixture tests for weekend/holiday/error boundary permutations.
2. Extend API contract tests for `regions`/`countries` normalization edge cases.
3. Keep snapshots byte-stable.
   Progress:
   - Added deterministic source utility tests for timeout configuration parsing and abort-error mapping:
     - `tests/sourceCommon.test.ts`
   - Added source-adapter regression tests for timeout error propagation and TradingView epoch timestamp parsing:
     - `tests/sourceAdapters.test.ts`
   - Re-ran full verify gate after coverage expansion:
     - `TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run verify:release`
     - `115/115` tests pass

### Acceptance
1. Snapshot tests unchanged except intentional approved updates.
2. All new tests pass in offline fixture mode.

## W4 Release-Gate Diagnostics Hardening
Status: Completed

1. Improve release-gate troubleshooting breadcrumbs for install/verify/smoke phases.
2. Ensure deterministic marker interpretation remains unambiguous.
3. Keep marker update flow race-safe.
   Progress:
   - Enhanced `scripts/check_release_gate.sh` diagnostics to output:
     - `run_id`
     - per-step outcomes (`install`/`verify`/`smoke`)
     - decoded smoke tail excerpts on failure
   - Preserved deterministic validity rule (`status=success` and SHA matching current release candidate semantics).

### Acceptance
1. Failures can be attributed to install/verify/smoke in one pass.
2. No regressions to marker write/validation behavior.

## W5 Release Scaffolding and Closure (`v0.1.5`)
Status: Completed

1. Create/update `docs/V0_1_5_RELEASE_DRAFT.md`.
2. Create/update `docs/V0_1_5_EVIDENCE.md`.
3. Close release with green verify + release-gate and publish tag.
   Progress:
   - Release gate marker validated on release-candidate SHA:
     - `run_id=22035467485`
     - `status=success` (`install/verify/smoke`)
   - Published release tag:
     - `v0.1.5` on `9beb641`
   - Finalized release records in governance docs.

### Acceptance
1. Release docs are complete and evidence-backed.
2. `docs/RELEASES.md` contains final `v0.1.5` entry on publish.

## Risk Register (`v0.1.5`)
1. Risk: live source markup drift introduces parser instability.
   - Impact: High
   - Mitigation: fixture-regression expansion and guarded parser changes.
2. Risk: release-gate marker lag causes temporary false negatives.
   - Impact: Medium
   - Mitigation: marker validation policy + deterministic retry loop.
3. Risk: accidental contract drift while hardening tests.
   - Impact: High
   - Mitigation: strict snapshot and API contract checks in every verify run.

## Task Backlog
1. `V-501` Baseline sync + verify + gate check for `v0.1.5` start.
2. `V-502` Implement SPEC-safe live adapter resilience hardening.
3. `V-503` Expand deterministic fixture/contract test matrix.
4. `V-504` Harden release-gate diagnostics and marker traceability.
5. `V-505` Finalize `v0.1.5` evidence and release publish.

## Current Task Status
1. `V-501`: Completed.
2. `V-502`: Completed.
3. `V-503`: Completed.
4. `V-504`: Completed.
5. `V-505`: Completed.

## Execution Order
1. W1 baseline sync and validation.
2. W2 live-mode adapter hardening.
3. W3 deterministic coverage expansion.
4. W4 release-gate diagnostics hardening.
5. W5 release closure and publish.

## Definition of Done
1. All `v0.1.5` tasks (`V-501`..`V-505`) are completed.
2. Full deterministic gates are green (`verify:release`, release-gate marker valid).
3. No drift against `RULES.md` strict text and ICS contracts.
4. `v0.1.5` release docs and release record are complete.
