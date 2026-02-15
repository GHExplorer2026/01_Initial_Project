# V0_1_5_RELEASE_DRAFT.md

## Release Candidate Scope
- SPEC-safe live-mode resilience hardening on top of `v0.1.4`.
- Deterministic fixture/contract coverage expansion.
- Release-gate diagnostics hardening without product-contract drift.

## Required Final Gates (Before Tag)
1. Local/CI quality gate:
   - `npm run verify:release`
   - status: `DONE` (`115/115` tests passed in Node-20 run)
2. Release Gate workflow on `main`:
   - `status=success`
   - `install=success`, `verify=success`, `smoke=success`
   - status: `DONE` (`run_id=22035467485`, `run_url=https://github.com/GHExplorer2026/01_Initial_Project/actions/runs/22035467485`)
3. Invariant checks:
   - strict output strings unchanged
   - TOP suffix unchanged (` - **TOP-EVENT**`)
   - ICS category rule unchanged (`CATEGORIES:Wirtschafts-Event` per VEVENT)
   - status: `DONE`
4. Scope contract checks:
   - `regions` remains primary
   - `countries` alias behavior unchanged
   - status: `DONE`

## Planned Release Notes Snippet
`v0.1.5` strengthens live-mode resilience and release-gate diagnostics while preserving all strict output and ICS contracts.

## Tagging Plan
1. Confirm all gates above.
2. Create annotated tag:
   - `git tag -a v0.1.5 -m "v0.1.5: live-mode resilience and gate diagnostics hardening"`
3. Push tag:
   - `git push origin v0.1.5`
4. Append final release entry in `docs/RELEASES.md`.

## Current Status
- `RELEASED`
- Published tag:
  - `v0.1.5` on commit `9beb641`

## Evidence Template
- `docs/V0_1_5_EVIDENCE.md`
