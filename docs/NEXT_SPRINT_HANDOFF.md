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
   - `docs/WIDGET_STYLE_GUIDE.md`
   - `docs/WIDGET_STYLE_GUIDE_ALIGNMENT.md`

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
1. `W-1115`: Completed. Runtime slice started with frozen contract manifest + deterministic freeze check.
2. `W-1116`: Completed. Runtime gate runner now emits deterministic artifacts under `widget-runtime/artifacts/`.
3. `W-1117`: Completed. First separated runtime RC dry run executed (`PASS` dry-run profile, `NO_GO` for full E5 profile).
4. `W-1118`: Promote runtime gate from dry-run profile to full E5 profile (`lint`, `unit`, `build`, security/compliance, rollback evidence).

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
- `docs/WIDGET_STYLE_GUIDE.md`
- `docs/WIDGET_STYLE_GUIDE_ALIGNMENT.md`
- `docs/WIDGET_EXECUTION_CHECKLIST.md`
- `docs/WIDGET_PROJECT_BOUNDARY.md`
- `docs/WIDGET_E2_FEED_INTEGRATION_PLAN.md`
- `docs/WIDGET_E2_EVIDENCE.md`
- `docs/WIDGET_E3_EVIDENCE.md`
- `docs/WIDGET_E2_E3_TRANSITION.md`
- `docs/WIDGET_E2E_SMOKE_BLOCKER.md`
- `docs/WIDGET_E2E_SMOKE_EVIDENCE.md`
- `docs/WIDGET_E4_PERSISTENCE_UX_EVIDENCE.md`
- `docs/WIDGET_W1115_EVIDENCE.md`
- `docs/WIDGET_W1116_EVIDENCE.md`
- `docs/WIDGET_W1117_RC_DRY_RUN_EVIDENCE.md`
- `widget-runtime/README.md`
- `widget-runtime/contracts/contract-freeze.sha256`
- `widget-runtime/docs/SCOPING.md`
- `widget-runtime/docs/EXECUTION_GATE.md`
- `widget-runtime/docs/RELEASE_GATE_EVIDENCE.md`
