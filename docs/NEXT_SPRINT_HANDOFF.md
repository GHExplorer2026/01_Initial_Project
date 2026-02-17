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
5. Next iteration planning gate package prepared:
   - `skills/ui-update-next-iteration-planning-gate/*`
   - `docs/V0_1_8_PLAN.md`
   - `docs/V0_1_8_EVIDENCE.md`
6. `v0.1.8` execution slice implemented:
   - Strict Output visibility toggle (`default off`)
   - TOP-EVENT and `importance=high` deterministic equivalence
   - ICS export filters (`icsImportance=high,medium`, OR semantics)
7. `v0.1.8` release candidate documentation finalized:
   - `docs/V0_1_8_RELEASE_DRAFT.md`
   - `docs/V0_1_8_EVIDENCE.md`
8. Windows Desktop Widget Option-C planning package finalized:
   - `docs/WIDGET_IMPLEMENTATION_PLAN.md`
   - `docs/WIDGET_FEED_CONTRACT.md`
   - `docs/WIDGET_SETTINGS_CONTRACT.md`
   - `docs/WIDGET_SPLIT_DELIVERY_PLAYBOOK.md`

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
1. `W-1101`: Freeze widget feed and settings contracts (`v1.1` / `v1`) and lock acceptance tests.
2. `W-1102`: Initialize separated desktop widget project boundary and release gate checklist.
3. `W-1103`: Start widget vertical slice (ticker shell + fixture feed) after contract approval.

## References
- `RULES.md`
- `docs/QA_STATUS.md`
- `docs/UI_EXECUTION_REPORT.md`
- `docs/release-gate-last-success.json`
- `skills/spec-safe-direct-delivery/SKILL.md`
- `skills/ui-update-next-iteration-planning-gate/SKILL.md`
- `docs/V0_1_8_PLAN.md`
- `docs/V0_1_8_EVIDENCE.md`
- `docs/V0_1_8_RELEASE_DRAFT.md`
- `docs/WIDGET_IMPLEMENTATION_PLAN.md`
- `docs/WIDGET_FEED_CONTRACT.md`
- `docs/WIDGET_SETTINGS_CONTRACT.md`
- `docs/WIDGET_SPLIT_DELIVERY_PLAYBOOK.md`
