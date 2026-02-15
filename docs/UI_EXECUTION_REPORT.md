# UI_EXECUTION_REPORT.md

## Run Metadata
- Date: `2026-02-15`
- Operators: `Codex` + live browser validation by user
- Runtime:
  - Node `v20.20.0`
  - `SOURCE_MODE=live` for browser validation
  - `SOURCE_MODE=fixtures` for deterministic smoke/gate checks

## Runtime Checks
1. UI shell and controls:
   - Result: PASS
   - Confirmed controls: `Country Scope`, `Alle`, `Keine`, generate button, ICS button, strict output block.
2. Live Country Scope filtering in browser:
   - Result: PASS
   - User-verified region-only outputs in strict text (including `CH` selection case).
3. Live API traces from browser flow:
   - Result: PASS
   - Observed successful scoped calls:
     - `/api/weekly?regions=CA`
     - `/api/weekly?regions=AU`
     - `/api/weekly?regions=USA`
     - `/api/weekly?regions=EZ`
     - `/api/weekly?regions=EZ,UK`
     - `/api/weekly?regions=UK`
     - `/api/weekly?regions=JP`
     - `/api/weekly?regions=JP,NZ`
     - `/api/weekly?regions=JP,AU,NZ`
     - `/api/weekly?regions=JP,CH,AU,NZ`
     - `/api/weekly?regions=CH`
     - `/api/weekly.ics?regions=CH`
4. Live ICS import in Outlook:
   - Result: PASS
   - Region label retained in event subject (`SUMMARY` includes region label).
5. Smoke script (`bash scripts/smoke_api.sh http://127.0.0.1:3000 USA,EZ fixtures`):
   - Result: PASS
   - Weekly + ICS contract checks completed (`[smoke] weekly ok`, `[smoke] ics ok`, `[smoke] done`).

## Deterministic Gates
1. `npm run verify:release`
   - Result: PASS
   - `unit`: pass
   - `snapshot`: pass
   - `lint`: pass
   - `typecheck`: pass
   - `build`: pass
   - tests: `131 / 131` passed

## Issues and Fixes Covered by This Report
1. ICS subject missing region label in Outlook:
   - Fix: `SUMMARY` now prepends fixed region label in ICS serializer.
2. Country Scope not enforced end-to-end:
   - Fix: hard scope filter added before strict render and ICS generation in orchestrator.
3. Regression hardening:
   - Smoke script now validates selected-region scope for strict weekly event lines and ICS `SUMMARY`.

## Final Status
- PASS / FAIL: `PASS`
- Notes:
  - Strict output and ICS mandatory contracts remain intact.
  - No RULES/spec drift introduced.
