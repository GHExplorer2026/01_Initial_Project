# Direct Path Cycle

## Standard Command Sequence

0. Ready check (required):
   - Confirm mapped rules (`R-*`) and targeted tests for this slice.
   - Confirm security-impact classification (`none|low|high`).
1. Targeted tests for changed area:
   - `TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run unit -- <tests...>`
2. Full deterministic verification:
   - `TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run verify`
3. Drift guard:
   - `npm run check:next-env` (or `npm run fix:next-env` before commit if needed)
4. Commit and push:
   - `git add -A`
   - `git commit -m "<slice message>"`
   - `git push origin main`
5. Release gate closure:
   - `PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run check:release-gate`
6. Evidence update:
   - Update status/evidence docs for the completed slice.

## Scripted Variant

- `bash skills/spec-safe-direct-delivery/scripts/run_direct_cycle.sh "<commit message>" [targeted test args...]`
- Examples:
  - `bash skills/spec-safe-direct-delivery/scripts/run_direct_cycle.sh "test(ui): harden contracts" tests/page.ui.contract.test.ts`
  - `bash skills/spec-safe-direct-delivery/scripts/run_direct_cycle.sh "docs: update evidence"`

## If Push Is Rejected

1. `git fetch origin main --prune`
2. `git rebase origin/main`
3. `git push origin main`

## Release-Gate Closure

1. `PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run check:release-gate`
2. If marker lags, rerun with bounded retry loop until valid for `HEAD`.

## Dependency Change Safety

If `package.json` or lockfiles changed in the slice:
1. Require full CI gate pass before closure.
2. Require explicit commit/PR note why dependency update was needed.
3. Do not bypass deterministic gate sequence.
