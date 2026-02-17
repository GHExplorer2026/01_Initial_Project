# QA_STATUS.md

## Consolidated Baseline (2026-02-17)
- Branch: `main`
- Repository state target: clean + synced with `origin/main`
- Product baseline: `v0.1.8` implementation slice completed on top of `v0.1.7`
- Current test baseline: `145` passing tests in Node `v20.20.0` environment

## Current Quality Gate Profile
- Deterministic local gate command:
  - `TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run verify:release`
- Required result:
  - `unit`: pass
  - `snapshot`: pass
  - `lint`: pass
  - `typecheck`: pass
  - `build`: pass
- Release gate command:
  - `PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run check:release-gate`
- Last confirmed release-gate run:
  - `run_id=22108356856`
  - `status=success` (`install=success`, `verify=success`, `smoke=success`)

## SPEC-Critical Coverage (active)
1. Strict DE output formatting (header/day/event line, canonical Hinweiszeilen, exact TOP suffix).
2. Source governance and priority (`Investing > TradingView > Tertiary`).
3. Scope contract (`regions` primary, `countries` deprecated alias).
4. Exact-time-only filtering and A-F category safety (`uncertain => exclude`).
5. Deterministic merge/dedupe/grouping behavior.
6. ICS contract invariants (CRLF/folding/VTIMEZONE/deterministic UID+DTSTAMP/category per VEVENT).
7. API route contracts for `/api/weekly` and `/api/weekly.ics`.
8. UI strict-output visibility toggle contract (`default off`, data contract unchanged).
9. TOP-EVENT and `importance=high` bidirectional consistency.
10. ICS importance pre-export filtering (`high` / `medium`, OR semantics).

## Post-Release Hardening Included
1. Outlook ICS subject parity:
   - ICS `SUMMARY` includes fixed region label.
2. End-to-end scope enforcement:
   - orchestrator applies selected `regions` before strict render and ICS generation.
3. Smoke hardening:
   - scope checks enforced in both strict weekly lines and ICS summaries.
4. Drift resilience:
   - dev wrappers normalize `next-env.d.ts` on exit.
5. Windows operator path:
   - desktop one-click launcher for live mode validated in user run.
6. v0.1.8 UI/API slice:
   - strict-output toggle in UI (`default off`)
   - deterministic TOP/importance equivalence normalization
   - ICS export filtering via `icsImportance` query contract

## Environment and Ops Constraints
- Local full verification must run on Node `>=20.9.0`.
- CI remains source of truth if local runtime/network differs.
- `SOURCE_MODE=fixtures` remains default for deterministic CI/tests.
- `SOURCE_MODE=live` is for runtime/manual validation only.

## Next Sprint Readiness
- Ready: `YES`
- Preconditions satisfied:
  1. Rules and governance are current (`RULES.md` + skills mitigation updates).
  2. Runtime startup paths are stable (CLI and Windows desktop launcher).
  3. Deterministic gates and release-gate workflow are operational.
  4. Current evidence docs are updated (`docs/UI_EXECUTION_REPORT.md`, `docs/release-gate-last-success.json`).
  5. Windows Desktop Widget Option-C planning docs and contracts are prepared for execution handoff.
  6. Widget Style Guide alignment is documented and mapped to contracts.
  7. Widget E2 feed-integration slice is implemented with deterministic route-contract tests.
  8. Widget E3 UI preview slice is implemented with targeted deterministic tests.
  9. Widget feed contract suite is explicit in CI baseline gates.
  10. E2->E3 transition evidence is documented and approved for next step.
  11. Separated desktop runtime scaffold exists (`widget-runtime/`) with gate docs.

## References
- `README.md`
- `docs/RELEASES.md`
- `docs/UI_EXECUTION_REPORT.md`
- `docs/TROUBLESHOOTING.md`
- `docs/release-gate-last-success.json`
- `docs/WIDGET_IMPLEMENTATION_PLAN.md`
- `docs/WIDGET_FEED_CONTRACT.md`
- `docs/WIDGET_SETTINGS_CONTRACT.md`
- `docs/WIDGET_STYLE_GUIDE.md`
- `docs/WIDGET_STYLE_GUIDE_ALIGNMENT.md`
- `docs/WIDGET_EXECUTION_CHECKLIST.md`
- `docs/WIDGET_PROJECT_BOUNDARY.md`
- `docs/WIDGET_E2_FEED_INTEGRATION_PLAN.md`
- `docs/WIDGET_E2_EVIDENCE.md`
- `docs/WIDGET_E3_EVIDENCE.md`
- `docs/WIDGET_E2_E3_TRANSITION.md`
