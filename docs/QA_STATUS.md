# QA_STATUS.md

## Consolidated Baseline (2026-02-15)
- Branch: `main`
- Repository state target: clean + synced with `origin/main`
- Product baseline: released `v0.1.7` plus post-release hardening fixes
- Current test baseline: `131` passing tests in Node `v20.20.0` environment

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

## SPEC-Critical Coverage (active)
1. Strict DE output formatting (header/day/event line, canonical Hinweiszeilen, exact TOP suffix).
2. Source governance and priority (`Investing > TradingView > Tertiary`).
3. Scope contract (`regions` primary, `countries` deprecated alias).
4. Exact-time-only filtering and A-F category safety (`uncertain => exclude`).
5. Deterministic merge/dedupe/grouping behavior.
6. ICS contract invariants (CRLF/folding/VTIMEZONE/deterministic UID+DTSTAMP/category per VEVENT).
7. API route contracts for `/api/weekly` and `/api/weekly.ics`.

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

## References
- `README.md`
- `docs/RELEASES.md`
- `docs/UI_EXECUTION_REPORT.md`
- `docs/TROUBLESHOOTING.md`
- `docs/release-gate-last-success.json`
