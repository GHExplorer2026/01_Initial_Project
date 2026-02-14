# QA_STATUS.md

## Current Branch
- Branch: `fix/source-mode-meta`
- Baseline: rebased on `origin/main`

## Latest Deterministic Gate Run
- Command:
  - `TMPDIR=/tmp TMP=/tmp TEMP=/tmp npm run verify`
- Result:
  - `unit`: pass
  - `snapshot`: pass
  - `lint`: pass
  - `typecheck`: pass
  - `build`: pass
  - Current passing tests: `82`

## Test Coverage Focus (SPEC-critical)
- Strict DE output formatting (headers, notes, TOP suffix)
- Source priority and tertiary trigger behavior
- Scope contract (`regions` primary, `countries` deprecated alias)
- Exact-time-only normalization and A-F classification
- Merge/dedupe/grouping determinism
- ICS RFC profile (CRLF, folding, VTIMEZONE, deterministic UID/DTSTAMP, category in every VEVENT)
- API contract behavior for `/api/weekly` and `/api/weekly.ics`

## Notes
- CI workflows run explicit `unit` and `snapshot` gates.
- Local consolidated check is available via `npm run verify`.
