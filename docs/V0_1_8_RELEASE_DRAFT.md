# V0_1_8_RELEASE_DRAFT.md

## Release Candidate Scope
- Implement strict-output visibility toggle in UI (`default off`) without changing canonical strict content rules.
- Enforce deterministic equivalence rule: `TOP-EVENT <=> importance=high`.
- Add ICS pre-export filtering (`icsImportance=high,medium`) with OR semantics and no-filter => all.
- Keep existing scope/source/ICS invariants unchanged.

## Required Final Gates (Before Tag)
1. Local quality gate:
   - `TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run verify`
   - status: `DONE` (`145/145` tests, lint/typecheck/build/check:next-env green)
2. Release Gate workflow on `main`:
   - `status=success`
   - `install=success`, `verify=success`, `smoke=success`
   - status: `DONE` (`run_id=22108356856`, `run_url=https://github.com/GHExplorer2026/01_Initial_Project/actions/runs/22108356856`)
3. Contract checks:
   - `regions` remains primary (`countries` alias unchanged)
   - strict output canonical strings unchanged
   - ICS invariants unchanged (`CATEGORIES`, deterministic UID/DTSTAMP, CRLF/Folding, VTIMEZONE)
   - status: `DONE`

## Planned Release Notes Snippet
`v0.1.8` adds a controlled strict-output display toggle, deterministic TOP/importance consistency, and selectable ICS export filters for `high` and `medium` importance classes, with no contract drift in strict output/ICS core invariants.

## Tagging Plan
1. Confirm all gates above.
2. Create annotated tag:
   - `git tag -a v0.1.8 -m "v0.1.8: strict toggle + ICS importance export filters"`
3. Push tag:
   - `git push origin v0.1.8`
4. Append final release entry in `docs/RELEASES.md`.

## Current Status
- `READY_FOR_TAG`
- Gate status:
  - local verify: pass
  - release gate: pass

## Evidence
- `docs/V0_1_8_EVIDENCE.md`

