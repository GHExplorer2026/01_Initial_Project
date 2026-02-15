# V0_1_1_RELEASE_DRAFT.md

## Release Candidate Scope
- Parser resilience hardening (Investing + TradingView live adapter drift tolerance).
- Fixture-first test hardening for source parser drift.
- Deterministic orchestrator coverage for partial live-source failures.
- CI diagnostics improvements with JUnit artifact uploads.

## Required Final Gates (Before Tag)
1. Node-20 local verify:
   - `npm run verify:release`
   - CI equivalent:
     - automatic on push to `main`
     - manual via workflow `Release Gate` (`.github/workflows/release-gate.yml`)
   - Status:
     - `DONE` (see `docs/V0_1_1_EVIDENCE.md`)
2. Release Gate workflow evidence on `main`:
   - workflow conclusion must be `success`
   - artifact bundle must be present
   - local deterministic marker check:
     - `npm run check:release-gate`
     - pass requires `status=success` and marker `sha == HEAD` (or `HEAD^` if `HEAD` is marker commit)
   - status:
     - `DONE` (`run_id=22033409824`, `run_url=https://github.com/GHExplorer2026/01_Initial_Project/actions/runs/22033409824`)
3. Invariant checks:
   - strict output note strings unchanged
   - TOP suffix exact ` - **TOP-EVENT**`
   - every VEVENT has `CATEGORIES:Wirtschafts-Event`
4. Release Gate workflow smoke check:
   - starts app on `127.0.0.1:3000`
   - runs `scripts/smoke_api.sh`

## Planned Release Notes Snippet
`v0.1.1` hardens deterministic parsing and CI diagnostics without changing product output contracts.

## Tagging Plan
1. Confirm all gates above.
2. Create annotated tag:
   - `git tag -a v0.1.1 -m "v0.1.1: parser/fixture hardening and ci diagnostics"`
3. Push tag:
   - `git push origin v0.1.1`
4. Append final release entry in `docs/RELEASES.md`.

## Current Status
- `RELEASED`
- Published tag:
  - `v0.1.1` on commit `cc9f5badb4e0d9617b08a6f1fec87344f6a7e3e5`
- Final gate run:
  - `https://github.com/GHExplorer2026/01_Initial_Project/actions/runs/22033462131`

## Evidence Template
- `docs/V0_1_1_EVIDENCE.md`
