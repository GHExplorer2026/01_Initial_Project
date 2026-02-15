# V0_1_3_PLAN.md

## Goal
Deliver a SPEC-safe operational hardening increment (`v0.1.3`) on top of released `v0.1.2`, without changing canonical output strings, rendering contracts, or ICS serialization rules.

## Guardrails (Non-Negotiable)
1. No changes to `RULES.md` canonical strings and mappings.
2. No changes to strict output formatting semantics in `src/core/rendererStrictDe.ts`.
3. No changes to ICS required profile and mandatory `CATEGORIES:Wirtschafts-Event`.
4. Fixture-first determinism remains default (`SOURCE_MODE=fixtures`) for tests and CI.
5. `regions` remains primary query parameter; `countries` remains deprecated alias only.

## In Scope
1. Operational reliability hardening for build/runtime execution paths.
2. Deterministic smoke and release-gate stability improvements.
3. Documentation and runbook consolidation for local live verification.
4. Additional SPEC-safe fixture/test coverage for high-risk fallback paths.

## Out of Scope
1. Feature additions in UI/API beyond existing contracts.
2. Changes to source priority, classification categories, or strict note strings.
3. New output formats or rendering variants.
4. Live-network dependencies in CI tests.

## Workstreams

## W1 Build vs Runtime Execution Hardening
Status: Completed

1. Validate that runtime execution paths use standalone output (`node .next/standalone/server.js`) consistently in automation.
2. Document required network split clearly:
   - Build: npm registry access
   - Runtime: source endpoints (Investing/TradingView/approved tertiary)
3. Keep production/runtime stages free from `npm install`.
   Progress:
   - Updated `package.json` runtime script to standalone server:
     - `start`: `node .next/standalone/server.js`
   - Kept `start:next` only as legacy fallback for diagnostics.

### Acceptance
1. CI and docs reflect the same runtime startup command.
2. No build-time package installation in runtime stage.

## W2 Release Gate Stability and Diagnostics
Status: Completed

1. Harden release marker update and validation flow to avoid stale SHA confusion.
2. Keep release-gate failure artifacts concise and actionable.
3. Ensure smoke checks continue enforcing:
   - weekly endpoint availability
   - ICS category requirement behavior without false negatives
   Progress:
   - Validated release-gate marker contract via local check:
     - `npm run check:release-gate`
   - Current validated success marker:
     - `run_id=22034330056`
     - `status=success`
     - `install=success`, `verify=success`, `smoke=success`

### Acceptance
1. `npm run check:release-gate` deterministic behavior is documented and stable.
2. Release-gate marker validation is unambiguous for `main` and marker commits.

## W3 Live-Mode Verification Runbook
Status: Completed

1. Provide explicit local commands for:
   - fixture mode verification
   - live mode verification
2. Add a compact troubleshooting path for DNS/registry resolution failures.
3. Keep live verification non-blocking for CI and snapshots.
   Progress:
   - Added DNS/network troubleshooting and recovery steps in:
     - `docs/TROUBLESHOOTING.md`
   - Kept explicit source-mode run commands in:
     - `README.md` (`SOURCE_MODE=fixtures` default, `SOURCE_MODE=live` local run)

### Acceptance
1. Operator can run live verification manually with two endpoint curls.
2. CI remains fully offline and deterministic.

## W4 Test Coverage Expansion (SPEC-safe)
Status: Completed

1. Expand fixture-based tests for fallback/empty-day behavior (weekend/holiday/error).
2. Expand API contract tests around `regions` vs deprecated `countries`.
3. Keep strict text and ICS golden snapshots byte-stable.
   Progress:
   - Added normalized query-contract route tests for both endpoints:
     - matching normalized sets are accepted
     - conflicting normalized sets return `400`
   - Added strict fallback rendering assertions for live source-failure path:
     - exactly 5 day headers (Mo-Fr)
     - exactly 5 fallback note lines
     - no event lines in fallback output
   - Re-ran deterministic quality gate:
     - `TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run verify:release`
     - `109/109` tests passing

### Acceptance
1. Added tests do not alter existing golden outputs.
2. Full verify gate remains green on Node `>=20.9.0`.

## Deliverables
1. Updated runbook/documentation for v0.1.3 scope.
2. Deterministic test additions for high-risk operational paths.
3. Updated release evidence docs on completion (`docs/V0_1_3_RELEASE_DRAFT.md`, `docs/V0_1_3_EVIDENCE.md`).

## Risk Register (`v0.1.3`)
1. Risk: DNS instability blocks local fetch/push/install operations.
   - Impact: High
   - Mitigation: CI-as-source-of-truth + explicit DNS troubleshooting runbook + retries.
2. Risk: release-gate marker drift causes false negative local validation.
   - Impact: Medium
   - Mitigation: marker validation flow documentation and deterministic SHA checks.
3. Risk: operational scripts regress strict output/ICS invariants indirectly.
   - Impact: High
   - Mitigation: keep invariant snapshot gates mandatory and unchanged.

## Task Backlog
1. `V-301` Align build/runtime execution docs and scripts.
2. `V-302` Expand SPEC-safe fallback and query-contract tests.
3. `V-303` Run final release gates and archive v0.1.3 evidence.

## Current Task Status
1. `V-301`: Completed.
2. `V-302`: Completed.
3. `V-303`: Completed (`run_id=22034624406`, marker valid for HEAD).

## Execution Order
1. W1 build/runtime hardening alignment.
2. W2 release gate stability improvements.
3. W3 live-mode runbook consolidation.
4. W4 test coverage expansion and gate proof.

## Definition of Done
1. `npm run verify:release` passes on Node `>=20.9.0`.
2. `Release Gate` success marker is valid for current release commit.
3. No drift against `RULES.md` and strict output/ICS contracts.
4. `v0.1.3` docs and evidence are complete and linked in `README.md`.
