# V0_1_3_RELEASE_DRAFT.md

## Release Candidate Scope
- Operational hardening without product-rule drift.
- Build/runtime execution path alignment (standalone runtime).
- Release-gate stability and diagnostics cleanup.
- Fixture-first fallback/query-contract test expansion.

## Required Final Gates (Before Tag)
1. Local/CI quality gate:
   - `npm run verify:release`
   - status: `DONE` (`109/109` tests passed in Node-20 run)
2. Release Gate workflow on `main`:
   - `status=success`
   - `install=success`, `verify=success`, `smoke=success`
   - status: `DONE` (`run_id=22034624406`, `run_url=https://github.com/GHExplorer2026/01_Initial_Project/actions/runs/22034624406`)
3. Invariant checks:
   - strict output strings unchanged
   - TOP suffix unchanged (` - **TOP-EVENT**`)
   - ICS category rule unchanged (`CATEGORIES:Wirtschafts-Event` per VEVENT)
   - status: `TODO`
4. Scope contract checks:
   - `regions` remains primary
   - `countries` deprecated alias behavior unchanged
   - status: `DONE`

## Planned Release Notes Snippet
`v0.1.3` hardens operational reliability (build/runtime split, release-gate diagnostics, and deterministic test coverage) without changing strict output or ICS product contracts.

## Tagging Plan
1. Confirm all gates above.
2. Create annotated tag:
   - `git tag -a v0.1.3 -m "v0.1.3: operational hardening and deterministic gate stability"`
3. Push tag:
   - `git push origin v0.1.3`
4. Append final release entry in `docs/RELEASES.md`.

## Current Status
- `READY FOR TAG`

## Evidence Template
- `docs/V0_1_3_EVIDENCE.md`
