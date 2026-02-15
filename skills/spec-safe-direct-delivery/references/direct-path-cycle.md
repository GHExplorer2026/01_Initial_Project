# Direct Path Cycle

## Standard Command Sequence

1. Targeted tests for changed area:
   - `TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run unit -- <tests...>`
2. Full deterministic verification:
   - `TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run verify`
3. Commit and push:
   - `git add -A`
   - `git commit -m "<slice message>"`
   - `git push origin main`

## If Push Is Rejected

1. `git fetch origin main --prune`
2. `git rebase origin/main`
3. `git push origin main`

## Release-Gate Closure

1. `PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run check:release-gate`
2. If marker lags, rerun with bounded retry loop until valid for `HEAD`.
