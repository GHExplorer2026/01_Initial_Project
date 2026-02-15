# UI_EXECUTION_REPORT.md

## Run Metadata
- Date: `2026-02-15`
- Operator: `Codex`
- Commit SHA: `d5dd0656829ee57aa72ce6f00a41da440d87b919`
- Node version:
  - Agent default: `v18.19.1`
  - Verification path: `v20.20.0` (`PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH"`)
- SOURCE_MODE: `fixtures`

## Runtime Checks
1. App startup (`npm run dev -- --hostname 127.0.0.1 --port 3000`)
   - Result: PASS (`http://127.0.0.1:3000`, Next.js ready)
2. UI controls rendered (`Country Scope`, `Alle`, `Keine`, Generate, ICS, Strict Output)
   - Result: PASS (`curl` content check returned all required controls)
3. Weekly API (`/api/weekly?regions=USA,EZ`) returns JSON with:
   - `meta.sourceMode`
   - `meta.sourcesUsed`
   - Result: PASS (`"sourceMode":"fixtures"`, `"sourcesUsed":["investing","tradingview"]`)
4. ICS API (`/api/weekly.ics?regions=USA,EZ`) headers:
   - `text/calendar; charset=utf-8`
   - `Content-Disposition: attachment`
   - Result: PASS (`200 OK`, `content-type: text/calendar; charset=utf-8`, attachment filename present)
5. Smoke script (`bash scripts/smoke_api.sh http://127.0.0.1:3000 USA,EZ`)
   - Result: PASS (`[smoke] weekly ok`, `[smoke] ics ok`, `[smoke] done`)

## Deterministic Gates
1. `npm run unit`
   - Result: PASS (via `npm run verify`, `18/18` files, `115/115` tests)
2. `npm run snapshot`
   - Result: PASS (via `npm run verify`, `18/18` files, `115/115` tests)
3. `npm run lint`
   - Result: PASS (via `npm run verify`)
4. `npm run typecheck`
   - Result: PASS (via `npm run verify`)
5. `npm run build`
   - Result: PASS (via `npm run verify`, routes `/`, `/api/weekly`, `/api/weekly.ics`)

## Issues and Fixes
- Issue: Initial `npm run verify` failed before tests executed with `EACCES: permission denied, mkdir '/mnt/c/Users/maloe/AppData/Local/Temp/.../ssr'`.
- Root cause: Environment temp directory permission issue in WSL/Windows temp path handoff.
- Fix: Re-run verification with `TMPDIR=/tmp` and Node 20 path.
- Verification: `TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run verify` completed successfully.

## Final Status
- PASS / FAIL: `PASS`
- Notes:
  - No strict-output string changes.
  - No ICS serialization rule changes.
  - No RULES/spec drift introduced in this run.
