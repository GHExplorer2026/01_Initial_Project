# QA_STATUS.md

## Current Branch
- Branch: `main` (post `v0.1.2` release)
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
  - Current passing tests: `105`
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
  - `v0.1.3` operational hardening planning documented in `docs/V0_1_3_PLAN.md`.
  - release templates initialized in `docs/V0_1_3_RELEASE_DRAFT.md` and `docs/V0_1_3_EVIDENCE.md`.
- `v0.1.2` UI implementation baseline added:
  - deterministic scope-state helpers in `src/app/scopeState.ts`
  - UI state/strict-output isolation refactor in `src/app/page.tsx`
  - helper tests in `tests/scopeState.ui.test.ts`
  - markup contract tests in `tests/page.ui.contract.test.ts`
  - deterministic endpoint helper tests in `tests/uiRequests.test.ts`
- `v0.1.2` release preparation docs initialized:
  - `docs/V0_1_2_RELEASE_DRAFT.md`
  - `docs/V0_1_2_EVIDENCE.md`
- Node-20 verify proof for current UI scope:
  - `TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run verify:release`
  - result: pass (`105/105` tests, lint/typecheck/build green)
- Default shell (`node 18`) still hits Vitest ESM startup issues; use Node `>=20.9.0` path override (plus `TMPDIR=/tmp`) or CI for full suite runs.
- Latest release-gate marker is green and synced for current release-doc commit:
  - `run_id=22034113407`
  - `status=success`
  - `install=success`, `verify=success`, `smoke=success`
- `next-env.d.ts` drift handling is documented in `docs/TROUBLESHOOTING.md`.
