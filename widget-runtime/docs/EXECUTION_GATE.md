# EXECUTION_GATE

## Scope
This gate applies to the separated widget runtime slice (Option C) and keeps feed/settings/style contracts frozen.

## Required Checks (minimal, deterministic)
1. `npm run check:widget-runtime-freeze`
2. `npm run contract:widget-feed`
3. `npm run typecheck`

## Evidence Rules
1. Record command outputs in `widget-runtime/docs/RELEASE_GATE_EVIDENCE.md`.
2. If a check fails, store the failing command and short root cause before any fix.
3. No runtime slice progression without a green freeze check.

## Exit
Gate is `PASS` only when all required checks pass in one run and evidence is updated.
