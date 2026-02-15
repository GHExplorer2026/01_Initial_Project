---
name: spec-safe-direct-delivery
description: Drive fast, high-quality delivery with minimal cycles under strict specs. Use when a user asks to accelerate implementation without quality loss, keep zero feature drift, and run deterministic batch-based verification with release-gate closure.
---

# SPEC-Safe Direct Delivery

## When to Use

Use this skill when the user asks for a faster path to completion while preserving strict contracts, deterministic behavior, and CI quality gates.

## Core Policy

1. Never change product contracts unless explicitly requested.
2. Batch related changes into one focused implementation slice.
3. During a slice, run targeted tests only.
4. At slice end, run one full deterministic gate:
   - `TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run verify`
5. Push immediately after green verification.
6. Ensure release-gate marker catches up to `HEAD` before declaring closure.
7. Default to this cadence across projects unless a repository defines stricter release rules.

## Sprint Phase Blueprint (fast, low-risk)

1. Planning (timeboxed, max 60 min):
   - Define Sprint Goal.
   - Select only DoR-ready slices.
   - Cap active slices to one per developer.
2. Execution (daily):
   - Build smallest testable slice.
   - Keep strict contract compatibility at all times.
   - Run targeted tests before context-switch.
3. Integration:
   - Run one full deterministic gate per slice-end.
   - Push immediately after green gate.
4. Review + Retro:
   - Demonstrate user-visible outcome against acceptance criteria.
   - Record one automation mitigation and one quality mitigation for next cycle.

## Mandatory Mitigations (DoR/DoD aligned)

Before implementation (DoR):
1. Map changes to exact `R-*` rules.
2. Define at least one regression test to add/update.
3. Classify security impact (`none|low|high`).
4. Define rollback path (commit revert or hotfix branch).

Before closure (DoD):
1. Targeted tests green.
2. Full deterministic gate green (`verify`/`verify:release`).
3. Release-gate marker validated for current head progression.
4. No unresolved workspace drift in generated files.
5. Evidence docs updated.

## Execution Cycle

1. Pick one narrow, SPEC-safe slice.
2. Implement with pure helper extraction where possible.
3. Add/extend deterministic tests for that slice.
4. Run targeted tests for edited area.
5. Run full verify once.
6. Commit + push.
7. Validate release gate marker.
8. Continue with next slice.

## Guardrails

1. No feature drift.
2. No strict-output string drift.
3. No ICS contract drift.
4. No live-network dependency in CI tests.
5. Keep `regions` as primary query contract.
6. No security shortcuts for speed (no secret commits, no bypass of required gates).
7. Do not postpone regression tests for later slices.

## Failure Handling

1. If full verify fails due environment temp-path issues, retry with `TMPDIR=/tmp`.
2. If push is rejected, `fetch` + `rebase origin/main` + push.
3. If release marker lags, poll with bounded retries until marker is valid for `HEAD`.

## Cross-Project Adoption

1. Add this skill folder to the target repo unchanged.
2. Keep project-specific contracts in that repo's own `RULES.md`.
3. Keep deterministic full-gate command centralized in the skill reference.
4. If the repo has Node version constraints, set command PATH explicitly in the cycle script.
5. Reuse the same marker-closure loop pattern for CI marker lag.

## Optional Automation

- Use `scripts/run_direct_cycle.sh` to execute one full slice end-to-end:
  - targeted unit tests (optional)
  - full verify
  - commit + push
  - release-gate closure check loop

## Why This Works

This flow mirrors Scrum's short inspect/adapt cycle while hard-binding quality and security gates into each slice, so cycle time improves without letting hidden debt accumulate.

## Reference

- See `references/direct-path-cycle.md` for command sequence.
