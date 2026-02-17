# NEXT_SPRINT_HANDOFF.md

## Purpose
Provide a clean, deterministic handoff baseline so the next scope can start immediately without setup churn.

## Baseline State (2026-02-17)
1. Product release baseline: `v0.1.7` finalized.
2. Post-release fixes applied:
   - ICS summary includes region label.
   - region scope enforcement applied before strict render and ICS generation.
   - smoke checks enforce scope in strict output and ICS.
   - Windows desktop one-click launcher for live mode is operational.
3. Governance hardening applied:
   - DoR/DoD/security/cycle mitigation rules are now explicit in `RULES.md`.
4. UI Update contract slice implemented:
   - strict header uses date range only (`DD.MM.YYYY – DD.MM.YYYY`)
   - dual view active (economic-calendar table + canonical strict output)
   - `All Day` events supported in strict output and ICS (`VALUE=DATE`)
   - ICS includes deterministic metrics lines in `DESCRIPTION`

## Entry Checklist (must pass before next slice)
1. `git status -sb` shows clean workspace.
2. `npm run check:next-env` passes.
3. `PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run check:release-gate` passes.
4. Next slice maps to concrete `R-*` rule IDs.
5. At least one deterministic regression test is pre-declared.

## Exit Checklist (must pass to close each slice)
1. Targeted tests for changed modules pass.
2. Full deterministic gate passes:
   - `TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run verify:release`
3. Release gate marker validates for current head progression.
4. Evidence docs updated (`README.md`, `docs/QA_STATUS.md`, relevant run/evidence files).

## Immediate Next-Scope Queue
1. `N-901`: run live-data evidence cycle for table metrics completeness (per-region sample week).
2. `N-902`: add fixture drift cases for all-day holiday rows and mixed timed/all-day duplicates.
3. `N-903`: finalize release evidence and gate closure for UI Update contract patch.

## References
- `RULES.md`
- `docs/QA_STATUS.md`
- `docs/UI_EXECUTION_REPORT.md`
- `docs/release-gate-last-success.json`
- `skills/spec-safe-direct-delivery/SKILL.md`
