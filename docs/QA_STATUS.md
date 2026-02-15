# QA_STATUS.md

## Current Branch
- Branch: `main` (post `v0.1.1` release)
- Baseline: synced with `origin/main`

## Latest Deterministic Gate Run
- Command:
  - `npm run verify:release`
- Result:
  - `unit`: pass
  - `snapshot`: pass
  - `lint`: pass
  - `typecheck`: pass
  - `build`: pass
  - Current passing tests: `92`
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
- Release finalized on `main` with tag `v0.1.1`.
- Final release-gate evidence:
  - `run_id=22033462131`
  - `status=success`
  - `install=success`, `verify=success`, `smoke=success`
- Next phase planned:
  - `v0.1.2` UX/UI implementation planning documented in `docs/V0_1_2_PLAN.md`.
- `v0.1.2` UI implementation baseline added:
  - deterministic scope-state helpers in `src/app/scopeState.ts`
  - UI state/strict-output isolation refactor in `src/app/page.tsx`
  - helper tests in `tests/scopeState.ui.test.ts`
  - markup contract tests in `tests/page.ui.contract.test.ts`
- `v0.1.2` release preparation docs initialized:
  - `docs/V0_1_2_RELEASE_DRAFT.md`
  - `docs/V0_1_2_EVIDENCE.md`
- Local unit execution for the new test file is blocked in this shell by Node 18 + Vitest ESM startup (`ERR_REQUIRE_ESM`); run full unit suite in Node `>=20.9.0` / CI.
- `next-env.d.ts` drift handling is documented in `docs/TROUBLESHOOTING.md`.
