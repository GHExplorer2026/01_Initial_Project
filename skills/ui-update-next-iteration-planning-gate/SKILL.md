---
name: ui-update-next-iteration-planning-gate
description: Create a deterministic, security-safe planning package for the next UI Update sprint in 01_Initial_Project, including skills/rules/doc patch proposals and explicit Project Gate criteria. No application code generation in this phase.
---

# UI Update Next Iteration Planning Gate

## When to Use
Use this skill when preparing the next sprint phase for UI enhancements in `01_Initial_Project`, where planning must be decision-complete before coding starts.

## Non-Negotiable Guardrails
1. No application code generation in this phase.
2. First deliver plan + governance patch proposal, then wait for explicit `Project Gate` approval.
3. Keep determinism, source governance, and existing product contracts unless explicitly rule-patched.
4. No hallucinated values for `Actual`, `Forecast`, `Previous`.
5. Keep tests token-efficient: targeted cycles during implementation, full gate only at release checkpoint.

## Inputs (must be analyzed)
1. Project root: `/mnt/c/Users/maloe/Documents/Codex_Projects/01_Initial_Project`
2. Existing governance:
- `RULES.md`
- `docs/IMPLEMENTATION_PLAN.md`
- active `skills/*`
3. Relevant UI/API modules:
- `src/app/page.tsx`
- `src/app/weeklyResponse.ts`
- `src/core/*`
- `src/server/*`
- `src/app/api/weekly*.ts`
4. Existing test baseline:
- `tests/*`
- `tests/fixtures/*`

## Execution Prompt Template (copy-paste)

You are `UI/UX Designer + world class Coding Expert + deterministic delivery lead` for `01_Initial_Project`.

Goal in this phase:
1. Define the implementation plan for sprint phase `UI Update (Next Iteration)`.
2. Propose required skills/agent-rules/doc updates.
3. Do NOT generate application code.
4. Stop at planning output and gate checklist.

Hard requirements:
1. Preserve all active deterministic and governance constraints.
2. Add a `Strict Output` UI visibility toggle with default `off`.
3. Keep economic calendar table as primary view.
4. Keep Strict Output canonical format unchanged in content rules; only visibility is toggled.
5. Enforce bidirectional logic:
- `Importance = high (3 stars) => TOP-EVENT`
- `TOP-EVENT => Importance = high (3 stars)`
6. Add pre-ICS export filter behavior in UI:
- Filter option `TOP-EVENT / 3 stars`
- Filter option `2 stars`
- No filter selected => export all events
- Selected filters => export only matching classes
7. Keep no-hallucination policy for all metrics fields.
8. Keep `regions` as primary scope contract.
9. Keep ICS mandatory invariants unchanged (CATEGORIES, deterministic UID/DTSTAMP, CRLF/Folding, VTIMEZONE).

Required planning decisions (must be explicit):
1. UI state model for toggle + ICS filter controls.
2. API contract for ICS export filtering parameter(s).
3. Normalization rule for TOP-EVENT/importance consistency.
4. Data flow from UI filter controls to `/api/weekly.ics`.
5. Minimal test-cycle strategy:
- targeted tests per slice
- full verify only at gate closure

Output format (strict):
1. `Section A: Current State and Gaps`
2. `Section B: Target UX/UI Contract`
3. `Section C: API/Type Contract Changes`
4. `Section D: Sprint Task Plan (file-level, test-level, CI-level)`
5. `Section E: Skills + Agent Rules Patch Plan`
6. `Section F: RULES.md / docs patch plan`
7. `Section G: Risks, Mitigations, Open Decisions`
8. `Section H: Project Gate Checklist (Go/No-Go)`

Stop condition:
- End after planning deliverables.
- Final line must be: `Reply with "GO" to start code generation.`

## Suggested Files To Update In Planning Phase
1. `docs/IMPLEMENTATION_PLAN.md` (new section for this sprint)
2. `RULES.md` (only if contract extension needed)
3. `docs/NEXT_SPRINT_HANDOFF.md`
4. `README.md` (scope/status alignment)
5. `skills/*` (updated and new skills if required)

## Acceptance Criteria For This Skill Output
1. No application code generated.
2. Plan is decision-complete and implementable without reinterpretation.
3. Strict-output toggle behavior is explicit (`default off`).
4. TOP-EVENT/importance bidirectional rule is explicit and testable.
5. ICS export filter behavior is explicit and testable.
6. Test-cycle minimization strategy is explicit without quality/security regression.
7. Project Gate remains mandatory before coding.

## Quick Workflow
1. Add this skill package.
2. Generate the next implementation plan with this template.
3. Validate plan against the gate checklist in `references/project-gate-checklist.md`.
4. Start coding only after explicit `GO`.
