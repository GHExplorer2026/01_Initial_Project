# V0_1_7_PLAN.md

## Goal
Deliver the `v0.1.7` execution-readiness increment on top of released `v0.1.6`, focused on deterministic UI execution proof, release-evidence hygiene, and operator-safe gating without any SPEC drift.

## Release Status
1. `v0.1.7` is not released.
2. Planned release tag: `v0.1.7`.
3. Entry criteria:
   - `main` synced with latest release-gate marker.
   - `npm run check:release-gate` valid for current `HEAD` (or marker commit on `HEAD^`).

## Guardrails (Non-Negotiable)
1. No changes to canonical rules in `RULES.md`.
2. No changes to strict renderer canonical strings or formatting.
3. No changes to ICS mandatory profile (`CATEGORIES:Wirtschafts-Event`, deterministic UID/DTSTAMP, CRLF/folding, VTIMEZONE).
4. Fixture-first determinism remains default in tests/CI (`SOURCE_MODE=fixtures`).
5. `regions` remains primary API query parameter; `countries` stays deprecated alias behavior.

## In Scope
1. Baseline synchronization and deterministic gate refresh for `v0.1.7` start.
2. SPEC-safe UI execution hardening (state safety, strict-output isolation, deterministic behavior under non-ideal browser/runtime conditions).
3. Release-evidence scaffold alignment (`plan`, `release draft`, `evidence`) for fast closure.
4. Deterministic verification rerun and release-gate closure for candidate publish.

## Out of Scope
1. Any product feature expansion or UI redesign.
2. Any strict-output or ICS schema/string changes.
3. Any source-priority or tertiary-governance changes.
4. Any CI dependence on live network for tests.

## Workstreams

## W1 Baseline Synchronization and Gate Validation
Status: Completed

1. Sync `main` and validate release marker alignment.
2. Re-run full deterministic verify gate in Node 20 baseline.
3. Record baseline evidence for `v0.1.7` start.
   Progress:
   - Synced `main` and validated marker:
     - `npm run check:release-gate` -> pass
     - `run_id=22038326822`
   - Re-ran deterministic verify gate in Node 20:
     - `TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run verify:release`
     - `129/129` tests pass

### Acceptance
1. `npm run verify:release` is green.
2. `npm run check:release-gate` is green for current baseline.

## W2 SPEC-safe UI Execution Hardening
Status: Completed

1. Review UI execution path for deterministic failure behavior (no strict-block contamination).
2. Add minimal, high-value tests for UI runtime edge safety where missing.
3. Preserve strict-output and ICS contract snapshots byte-stable.
   Progress:
   - Hardened UI metadata rendering determinism by normalizing and sorting `meta.sourcesUsed` for stable display order:
     - `src/app/weeklyResponse.ts`
   - Added targeted regression test for sorted source ordering:
     - `tests/weeklyResponse.ui.test.ts`
   - Hardened UI error rendering determinism with stable non-API fallback messages and added regression coverage:
     - `src/app/uiState.ts`
     - `tests/uiState.ui.test.ts`
   - Re-ran full deterministic gate:
     - `TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run verify:release`
     - `130/130` tests pass

### Acceptance
1. No strict-output drift.
2. No ICS contract drift.
3. Added tests are deterministic and CI-safe.

## W3 Release Evidence and Operability Hygiene
Status: Completed

1. Keep release-draft and evidence docs aligned with actual gate behavior.
2. Ensure marker diagnostics remain actionable from a single command (`npm run check:release-gate`).
3. Preserve deterministic troubleshooting flow for marker lag/race conditions.
   Progress:
   - Refreshed release evidence and draft alignment to current deterministic verify baseline (`130/130`).
   - Revalidated release-gate marker after UI hardening:
     - `run_id=22038517413`
     - `status=success` (`install/verify/smoke`)

### Acceptance
1. Release documentation is actionable and current.
2. Gate failures remain attributable (`install`/`verify`/`smoke`).

## W4 Release Closure (`v0.1.7`)
Status: In Progress

1. Finalize `docs/V0_1_7_RELEASE_DRAFT.md`.
2. Finalize `docs/V0_1_7_EVIDENCE.md`.
3. Close release with green verify + release-gate and publish tag.

### Acceptance
1. Release docs are complete and evidence-backed.
2. `docs/RELEASES.md` contains final `v0.1.7` entry on publish.

## Risk Register (`v0.1.7`)
1. Risk: accidental contract drift while hardening UI execution edge tests.
   - Impact: High
   - Mitigation: snapshot gates + exact canonical invariant assertions.
2. Risk: release-gate marker timing lag causes temporary false negatives.
   - Impact: Medium
   - Mitigation: deterministic retry policy + marker validation rule.
3. Risk: local environment drift (Node/DNS) masks reproducibility.
   - Impact: Medium
   - Mitigation: Node 20 baseline + CI source-of-truth + documented run commands.

## Task Backlog
1. `V-701` Baseline sync + verify + gate check for `v0.1.7` start.
2. `V-702` Implement SPEC-safe UI execution hardening slice.
3. `V-703` Expand deterministic UI execution edge coverage.
4. `V-704` Re-run full deterministic gates post-hardening.
5. `V-705` Finalize `v0.1.7` evidence and release publish.

## Current Task Status
1. `V-701`: Completed.
2. `V-702`: Completed.
3. `V-703`: Completed.
4. `V-704`: Completed.
5. `V-705`: Planned.

## Execution Order
1. W1 baseline sync and validation.
2. W2 UI execution hardening.
3. W3 release evidence/operability hygiene.
4. W4 release closure and publish.

## Definition of Done
1. All `v0.1.7` tasks (`V-701`..`V-705`) are completed.
2. Full deterministic gates are green (`verify:release`, release-gate marker valid).
3. No drift against `RULES.md` strict text and ICS contracts.
4. `v0.1.7` release docs and release record are complete.
