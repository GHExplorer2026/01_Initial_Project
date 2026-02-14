# MERGE_STEPS.md

## Goal
Finalize `fix/source-mode-meta` into `main` with deterministic validation guarantees.

## Preconditions
- Local verify already passed on Node `v20.20.0` / npm `10.8.2`.
- Branch is ahead of `origin/main` and not behind.

## Merge Procedure
1. Ensure latest refs:
   - `git fetch --all --prune`
2. Switch to `main` and update:
   - `git switch main`
   - `git pull --ff-only origin main`
3. Merge feature branch:
   - `git merge --ff-only origin/fix/source-mode-meta`
4. Push `main`:
   - `git push origin main`

## Post-Merge Validation
1. Confirm CI pipeline is green (`lint`, `typecheck`, `unit`, `snapshot`, `build`).
2. Confirm API contracts manually:
   - `GET /api/weekly?regions=USA,EZ`
   - `GET /api/weekly.ics?regions=USA,EZ`
3. Confirm strict output and ICS invariants are unchanged:
   - strict note lines exact
   - TOP suffix exact ` - **TOP-EVENT**`
   - every VEVENT includes `CATEGORIES:Wirtschafts-Event`

## Cleanup
1. Optional local cleanup:
   - `git branch -d fix/source-mode-meta`
2. Optional remote cleanup:
   - `git push origin --delete fix/source-mode-meta`
