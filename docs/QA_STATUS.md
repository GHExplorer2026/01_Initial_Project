# QA_STATUS.md

## Current Branch
- Branch: `main` (post-merge from `fix/source-mode-meta`)
- Baseline: synced with `origin/main`

## Latest Deterministic Gate Run
- Command:
  - `npm run verify`
- Result:
  - `unit`: pass
  - `snapshot`: pass
  - `lint`: pass
  - `typecheck`: pass
  - `build`: pass
  - Current passing tests: `89`
- Environment:
  - Node `v20.20.0`
  - npm `10.8.2`

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
- CI uploads JUnit artifacts for `unit` and `snapshot` runs (`artifacts/vitest-*.xml`).
- Troubleshooting for CI test artifacts is documented in `docs/TROUBLESHOOTING.md`.
- Local consolidated check is available via `npm run verify`.
- Local verification requires Node `>=20.9.0`; CI remains source of truth when local runner is below baseline.
- `next build` generated updates were committed (`tsconfig.json`, `next-env.d.ts`) to keep repository and build output aligned.
- Additional SPEC edge-case tests were added for:
  - weekend week-window resolution in orchestrator
  - empty `regions` parameter with deprecated `countries` alias fallback
- Release finalized on `main` with tag `v0.1.0`; `origin/fix/source-mode-meta` was deleted after merge.
- `next-env.d.ts` drift handling is documented in `docs/TROUBLESHOOTING.md`.
