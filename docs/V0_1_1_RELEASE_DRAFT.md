# V0_1_1_RELEASE_DRAFT.md

## Release Candidate Scope
- Parser resilience hardening (Investing + TradingView live adapter drift tolerance).
- Fixture-first test hardening for source parser drift.
- Deterministic orchestrator coverage for partial live-source failures.
- CI diagnostics improvements with JUnit artifact uploads.

## Required Final Gates (Before Tag)
1. Node-20 local verify:
   - `npm run verify`
2. CI green on `main`:
   - `lint`, `typecheck`, `unit`, `snapshot`, `build`
3. Manual API smoke:
   - `GET /api/weekly?regions=USA,EZ`
   - `GET /api/weekly.ics?regions=USA,EZ`
4. Invariant checks:
   - strict output note strings unchanged
   - TOP suffix exact ` - **TOP-EVENT**`
   - every VEVENT has `CATEGORIES:Wirtschafts-Event`

## Planned Release Notes Snippet
`v0.1.1` hardens deterministic parsing and CI diagnostics without changing product output contracts.

## Tagging Plan
1. Confirm all gates above.
2. Create annotated tag:
   - `git tag -a v0.1.1 -m "v0.1.1: parser/fixture hardening and ci diagnostics"`
3. Push tag:
   - `git push origin v0.1.1`
4. Append final release entry in `docs/RELEASES.md`.
