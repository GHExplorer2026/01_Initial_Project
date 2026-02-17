# EXECUTION_GATE

## Scope
This gate applies to the separated widget runtime slice (Option C) and keeps feed/settings/style contracts frozen.

## Required Checks (minimal, deterministic)
1. `npm run gate:widget-runtime` (preferred single-run gate command)
2. Equivalent explicit checks:
   - `npm run check:widget-runtime-freeze`
   - `npm run contract:widget-feed`
   - `npm run typecheck`

## Evidence Rules
1. Store generated artifacts in `widget-runtime/artifacts/`.
2. Record command outputs in `widget-runtime/docs/RELEASE_GATE_EVIDENCE.md`.
3. If a check fails, store the failing command and short root cause before any fix.
4. No runtime slice progression without a green freeze check.

## Exit
Gate is `PASS` only when all required checks pass in one run and evidence is updated.
