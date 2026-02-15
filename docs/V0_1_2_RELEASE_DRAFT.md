# V0_1_2_RELEASE_DRAFT.md

## Release Candidate Scope
- UX/UI implementation for region scope selection and action flow.
- Deterministic query/storage scope synchronization.
- Strict output block isolation in UI.
- UI contract and baseline a11y markup tests.

## Required Final Gates (Before Tag)
1. Local/CI quality gate:
   - `npm run verify:release`
   - status: `DONE` (`105/105` tests passed in Node-20 run)
2. Release Gate workflow on `main`:
   - `status=success`
   - `install=success`, `verify=success`, `smoke=success`
   - status: `DONE` (`run_id=22034113407`, `run_url=https://github.com/GHExplorer2026/01_Initial_Project/actions/runs/22034113407`)
3. Invariant checks:
   - strict output strings unchanged
   - TOP suffix unchanged (` - **TOP-EVENT**`)
   - ICS category rule unchanged (`CATEGORIES:Wirtschafts-Event` per VEVENT)
4. UI contract checks:
   - scope controls rendered and deterministic
   - strict output remains isolated from status/debug text
   - status: `DONE`

## Planned Release Notes Snippet
`v0.1.2` introduces deterministic UX/UI flow completion (scope controls, strict-output isolation, and ICS action flow) without changing output or ICS product contracts.

## Tagging Plan
1. Confirm all gates above.
2. Create annotated tag:
   - `git tag -a v0.1.2 -m "v0.1.2: ux/ui implementation and contract tests"`
3. Push tag:
   - `git push origin v0.1.2`
4. Append final release entry in `docs/RELEASES.md`.

## Current Status
- `READY FOR TAG`

## Evidence Template
- `docs/V0_1_2_EVIDENCE.md`
