# V0_1_4_RELEASE_DRAFT.md

## Release Candidate Scope
- SPEC-safe reliability and release-readiness hardening on top of `v0.1.3`.
- Runbook and governance updates for deterministic operations.
- Fixture-first contract coverage expansion without output-rule drift.

## Required Final Gates (Before Tag)
1. Local/CI quality gate:
   - `npm run verify:release`
   - status: `DONE` (`111/111` tests passed in Node-20 run)
2. Release Gate workflow on `main`:
   - `status=success`
   - `install=success`, `verify=success`, `smoke=success`
   - status: `DONE` (`run_id=22034861927`, `run_url=https://github.com/GHExplorer2026/01_Initial_Project/actions/runs/22034861927`)
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
`v0.1.4` reinforces deterministic operational quality (verification baseline refresh, runbook hardening, and contract-focused tests) without changing strict output or ICS product contracts.

## Tagging Plan
1. Confirm all gates above.
2. Create annotated tag:
   - `git tag -a v0.1.4 -m "v0.1.4: deterministic reliability and release-readiness hardening"`
3. Push tag:
   - `git push origin v0.1.4`
4. Append final release entry in `docs/RELEASES.md`.

## Current Status
- `READY FOR TAG`

## Evidence Template
- `docs/V0_1_4_EVIDENCE.md`
