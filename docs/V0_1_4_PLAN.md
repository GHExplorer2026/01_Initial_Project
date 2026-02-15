# V0_1_4_PLAN.md

## Goal
Deliver a SPEC-safe reliability and release-readiness increment (`v0.1.4`) on top of released `v0.1.3`, without changing strict output or ICS product contracts.

## Guardrails (Non-Negotiable)
1. No changes to canonical rules in `RULES.md`.
2. No changes to strict renderer semantics or canonical fallback strings.
3. No changes to ICS mandatory profile (`CATEGORIES:Wirtschafts-Event`, deterministic UID/DTSTAMP, CRLF/folding, VTIMEZONE).
4. Fixture-first determinism remains default (`SOURCE_MODE=fixtures`) in CI/tests.
5. `regions` remains primary API query contract; `countries` stays deprecated alias behavior.

## In Scope
1. Baseline verification refresh for post-`v0.1.3` state.
2. Planning and release scaffolding for `v0.1.4`.
3. Operator runbook hardening for DNS/network flaps and deterministic verification.
4. Additional SPEC-safe coverage for high-risk fallback/contract paths.

## Out of Scope
1. Feature expansion in UI/API output.
2. New data-source behavior or governance changes.
3. Any contract changes to strict text or ICS output.
4. Live-network dependencies in CI execution.

## Workstreams

## W1 Baseline Verification Refresh
Status: Completed

1. Re-run deterministic quality gate on Node 20.
2. Confirm release-gate marker validity for current `HEAD`.
3. Record refreshed baseline evidence for `v0.1.4` planning.

### Acceptance
1. `npm run verify:release` is green.
2. `npm run check:release-gate` is green.

## W2 v0.1.4 Planning and Release Scaffolding
Status: Completed

1. Create `docs/V0_1_4_PLAN.md`.
2. Create `docs/V0_1_4_RELEASE_DRAFT.md`.
3. Create `docs/V0_1_4_EVIDENCE.md`.

### Acceptance
1. All three docs are present and linked from project governance docs.
2. Task backlog is explicit and executable.

## W3 Network/DNS Runbook Hardening
Status: Completed

1. Keep deterministic DNS recovery steps documented for intermittent resolver failures.
2. Keep fallback Git transport approach documented for emergency sync.
3. Ensure operator commands are concise and repeatable.
   Progress:
   - Existing troubleshooting runbook verified against current incident pattern:
     - DNS flaps and registry/git recovery paths remain valid in `docs/TROUBLESHOOTING.md`.
   - Manual operator validation completed and documented via `V-404` evidence update.

### Acceptance
1. Runbook includes concrete recovery commands.
2. No CI behavior drift introduced.

## W4 SPEC-safe Contract Coverage
Status: Completed

1. Add or refine fixture-first tests for fallback and query contract edge cases.
2. Keep strict text and ICS snapshots byte-stable.
3. Re-run full verify gate after any test additions.
   Progress:
   - Added additional route contract tests for deprecated `countries` normalization:
     - `tests/api.weekly.route.test.ts`
     - `tests/api.weekly-ics.route.test.ts`
   - Re-ran deterministic quality gate:
     - `TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run verify:release`
     - `111/111` tests passing

### Acceptance
1. No golden snapshot drift.
2. Verify gate remains green.

## Deliverables
1. `docs/V0_1_4_PLAN.md`
2. `docs/V0_1_4_RELEASE_DRAFT.md`
3. `docs/V0_1_4_EVIDENCE.md`
4. Updated governance status docs (`README.md`, `docs/QA_STATUS.md`, `docs/RELEASES.md`)

## Risk Register (`v0.1.4`)
1. Risk: intermittent DNS breaks git/npm operations.
   - Impact: High
   - Mitigation: documented resolver recovery + CI as source of truth.
2. Risk: release-gate marker lag causes temporary false negatives.
   - Impact: Medium
   - Mitigation: retry loop + marker validation policy.
3. Risk: accidental contract drift while hardening tests.
   - Impact: High
   - Mitigation: strict snapshot and API contract checks.

## Task Backlog
1. `V-401` Re-run and document baseline verify + release-gate checks.
2. `V-402` Publish v0.1.4 planning/release scaffolding docs.
3. `V-403` Expand SPEC-safe fallback/contract coverage and re-verify.
4. `V-404` Finalize `v0.1.4` release evidence and gate closure.

## Current Task Status
1. `V-401`: Completed.
2. `V-402`: Completed.
3. `V-403`: Completed.
4. `V-404`: Completed (`run_id=22034861927`, marker valid for release candidate SHA `41f05b8`).

## Execution Order
1. W1 Baseline verification refresh.
2. W2 Planning and release scaffolding.
3. W3 Runbook hardening.
4. W4 Contract coverage expansion.

## Definition of Done
1. Verify and release-gate checks are green for current release candidate commit.
2. `v0.1.4` evidence and release docs are complete.
3. No drift against `RULES.md` or strict output/ICS contracts.
