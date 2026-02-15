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

## Failure Handling

1. If full verify fails due environment temp-path issues, retry with `TMPDIR=/tmp`.
2. If push is rejected, `fetch` + `rebase origin/main` + push.
3. If release marker lags, poll with bounded retries until marker is valid for `HEAD`.

## Reference

- See `references/direct-path-cycle.md` for command sequence.
