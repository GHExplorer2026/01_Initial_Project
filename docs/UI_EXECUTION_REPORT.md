# UI_EXECUTION_REPORT.md

## Run Metadata
- Date:
- Operator:
- Commit SHA:
- Node version:
- SOURCE_MODE:

## Runtime Checks
1. App startup (`npm run dev -- --hostname 127.0.0.1 --port 3000`)
   - Result:
2. UI controls rendered (`Country Scope`, `Alle`, `Keine`, Generate, ICS, Strict Output)
   - Result:
3. Weekly API (`/api/weekly?regions=USA,EZ`) returns JSON with:
   - `meta.sourceMode`
   - `meta.sourcesUsed`
   - Result:
4. ICS API (`/api/weekly.ics?regions=USA,EZ`) headers:
   - `text/calendar; charset=utf-8`
   - `Content-Disposition: attachment`
   - Result:
5. Smoke script (`bash scripts/smoke_api.sh http://127.0.0.1:3000 USA,EZ`)
   - Result:

## Deterministic Gates
1. `npm run unit`
   - Result:
2. `npm run snapshot`
   - Result:
3. `npm run lint`
   - Result:
4. `npm run typecheck`
   - Result:
5. `npm run build`
   - Result:

## Issues and Fixes
- Issue:
- Root cause:
- Fix:
- Verification:

## Final Status
- PASS / FAIL:
- Notes:
