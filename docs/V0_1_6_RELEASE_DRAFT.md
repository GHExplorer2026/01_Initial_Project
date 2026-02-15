# V0_1_6_RELEASE_DRAFT.md

## Release Candidate Scope
- SPEC-safe contract-proofing hardening on top of `v0.1.5`.
- Deterministic release-operability and gate diagnostics improvements.
- No product-contract drift in strict output or ICS.

## Required Final Gates (Before Tag)
1. Local/CI quality gate:
   - `npm run verify:release`
   - status: `PENDING`
2. Release Gate workflow on `main`:
   - `status=success`
   - `install=success`, `verify=success`, `smoke=success`
   - status: `PENDING`
3. Invariant checks:
   - strict output strings unchanged
   - TOP suffix unchanged (` - **TOP-EVENT**`)
   - ICS category rule unchanged (`CATEGORIES:Wirtschafts-Event` per VEVENT)
   - status: `PENDING`
4. Scope contract checks:
   - `regions` remains primary
   - `countries` alias behavior unchanged
   - status: `PENDING`

## Planned Release Notes Snippet
`v0.1.6` strengthens deterministic contract-proofing and release operability while preserving strict output and ICS contracts.

## Tagging Plan
1. Confirm all gates above.
2. Create annotated tag:
   - `git tag -a v0.1.6 -m "v0.1.6: deterministic contract-proofing and release-operability hardening"`
3. Push tag:
   - `git push origin v0.1.6`
4. Append final release entry in `docs/RELEASES.md`.

## Current Status
- `PLANNED`

## Evidence Template
- `docs/V0_1_6_EVIDENCE.md`
