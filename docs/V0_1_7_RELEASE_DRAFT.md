# V0_1_7_RELEASE_DRAFT.md

## Release Candidate Scope
- SPEC-safe UI execution-readiness hardening on top of `v0.1.6`.
- Deterministic release-evidence and operator-gate hygiene improvements.
- No product-contract drift in strict output or ICS.

## Required Final Gates (Before Tag)
1. Local/CI quality gate:
   - `npm run verify:release`
   - status: `DONE` (`130/130` tests passed in Node-20 run)
2. Release Gate workflow on `main`:
   - `status=success`
   - `install=success`, `verify=success`, `smoke=success`
   - status: `DONE` (`run_id=22038517413`, `run_url=https://github.com/GHExplorer2026/01_Initial_Project/actions/runs/22038517413`)
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
`v0.1.7` hardens deterministic UI execution readiness and release evidence flow while preserving strict output and ICS contracts.

## Tagging Plan
1. Confirm all gates above.
2. Create annotated tag:
   - `git tag -a v0.1.7 -m "v0.1.7: deterministic UI execution-readiness hardening"`
3. Push tag:
   - `git push origin v0.1.7`
4. Append final release entry in `docs/RELEASES.md`.

## Current Status
- `READY_FOR_TAG`
- Publish target:
  - `v0.1.7` on `main` (all pre-tag gates are green).

## Evidence Template
- `docs/V0_1_7_EVIDENCE.md`
