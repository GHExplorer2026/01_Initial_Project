# V0_1_6_PLAN.md

## Goal
Deliver the `v0.1.6` hardening increment on top of released `v0.1.5`, focused on deterministic contract-proofing and release-operability hardening without any SPEC drift.

## Release Status
1. `v0.1.6` is in planning.
2. Baseline release remains `v0.1.5`.
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
1. Baseline synchronization and deterministic gate refresh for `v0.1.6` start.
2. SPEC-safe contract-proofing tests for high-risk boundaries (scope/query, fallback notes, ICS invariants).
3. Release-operability hardening for marker diagnostics and operator runbook clarity.
4. `v0.1.6` release scaffolding and evidence closure.

## Out of Scope
1. Any UI redesign or new product feature set.
2. Any output schema changes in strict text or ICS export.
3. Any source-priority or tertiary-governance rule changes.
4. Any CI dependence on live network for test execution.

## Workstreams

## W1 Baseline Synchronization and Gate Validation
Status: Planned

1. Sync `main` and validate release marker alignment.
2. Re-run full deterministic verify gate in Node 20 baseline.
3. Record baseline evidence for `v0.1.6` start.

### Acceptance
1. `npm run verify:release` is green.
2. `npm run check:release-gate` is green for current baseline.

## W2 Contract-Proofing Expansion (SPEC-safe)
Status: Planned

1. Expand deterministic tests for fallback/note-line invariants and scope edge cases.
2. Strengthen ICS contract assertions (mandatory category, deterministic DTSTAMP/UID behavior under fixtures).
3. Preserve snapshot byte stability.

### Acceptance
1. No strict-output drift.
2. No ICS contract drift.
3. New tests are deterministic and CI-safe.

## W3 Release Operability Hardening
Status: Planned

1. Improve operator-facing release-gate diagnostics/playbook references.
2. Keep marker validation behavior deterministic and race-safe.
3. Ensure failure triage remains single-pass (`install`/`verify`/`smoke`).

### Acceptance
1. Gate failures are attributable in one run.
2. No regression in release-gate marker semantics.

## W4 Release Scaffolding and Closure (`v0.1.6`)
Status: Planned

1. Create/update `docs/V0_1_6_RELEASE_DRAFT.md`.
2. Create/update `docs/V0_1_6_EVIDENCE.md`.
3. Close release with green verify + release-gate and publish tag.

### Acceptance
1. Release docs are complete and evidence-backed.
2. `docs/RELEASES.md` contains final `v0.1.6` entry on publish.

## Risk Register (`v0.1.6`)
1. Risk: accidental contract drift while expanding hardening tests.
   - Impact: High
   - Mitigation: snapshot gates + explicit invariant checks.
2. Risk: release-gate marker lag creates temporary false negatives.
   - Impact: Medium
   - Mitigation: deterministic retry policy + marker validation rule.
3. Risk: local environment drift (Node/DNS) masks reproducibility.
   - Impact: Medium
   - Mitigation: Node 20 baseline + CI source-of-truth + documented run commands.

## Task Backlog
1. `V-601` Baseline sync + verify + gate check for `v0.1.6` start.
2. `V-602` Expand SPEC-safe contract-proofing tests.
3. `V-603` Harden release-operability diagnostics/runbook references.
4. `V-604` Re-run full deterministic gates post-hardening.
5. `V-605` Finalize `v0.1.6` evidence and release publish.

## Current Task Status
1. `V-601`: Open.
2. `V-602`: Open.
3. `V-603`: Open.
4. `V-604`: Open.
5. `V-605`: Open.

## Execution Order
1. W1 baseline sync and validation.
2. W2 contract-proofing expansion.
3. W3 release-operability hardening.
4. W4 release closure and publish.

## Definition of Done
1. All `v0.1.6` tasks (`V-601`..`V-605`) are completed.
2. Full deterministic gates are green (`verify:release`, release-gate marker valid).
3. No drift against `RULES.md` strict text and ICS contracts.
4. `v0.1.6` release docs and release record are complete.
