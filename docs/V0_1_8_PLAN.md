# V0_1_8_PLAN.md

## Goal
Define a decision-complete implementation plan for the next UI iteration (strict-output toggle, TOP/importance consistency, ICS export filtering) without generating application code in this phase.

## Planning Status
1. Phase type: Planning only.
2. Application code changes: None allowed.
3. Gate requirement: explicit user approval before execution (`GO`).

## Non-Negotiable Guardrails
1. Keep deterministic behavior and source governance unchanged.
2. Keep canonical strict-output content rules unchanged; only visibility control is added in scope.
3. Keep ICS invariants unchanged (`CATEGORIES`, deterministic `UID`/`DTSTAMP`, CRLF/Folding, VTIMEZONE).
4. Keep `regions` as primary scope contract.
5. Keep test cycles minimal during execution, but preserve full release gate at closure.

## Section A: Current State and Gaps

### A1) Current state (baseline)
1. Economic calendar table is already primary UI view.
2. Strict output block is currently rendered directly without visibility toggle.
3. TOP-EVENT logic is keyword/classification-driven and rendered with suffix ` - **TOP-EVENT**`.
4. Importance is available as `unknown|low|medium|high`, but bidirectional normalization `high <=> TOP-EVENT` is not yet enforced as a dedicated contract.
5. ICS endpoint currently exports all scoped events.
6. Existing deterministic contracts are active (`regions` primary, no-hallucination metrics, ICS invariants).

### A2) Gap list
1. Missing UI control: strict output on/off toggle (default off).
2. Missing explicit consistency rule in runtime path: `TOP-EVENT <=> importance=high`.
3. Missing ICS pre-export filter controls for `high` and `medium` importance classes.
4. Missing API query contract extension for ICS filtering.

## Section B: Target UX/UI Contract

### B1) View behavior
1. Calendar table remains primary.
2. Add UI toggle `Strict Output anzeigen`:
- default: `off`
- `on`: canonical strict output block becomes visible
- `off`: strict output hidden from UI only (data remains available in API response)

### B2) ICS export filter UX
1. Add filter controls in the action panel (before `.ICS herunterladen`):
- `TOP-EVENT / 3 Sterne`
- `2 Sterne`
2. Selection semantics (OR):
- none selected => all events exported
- only `TOP-EVENT / 3 Sterne` => `high`
- only `2 Sterne` => `medium`
- both selected => `high + medium`

### B3) Importance/TOP-EVENT equivalence
1. UI contract explicitly treats `importance=high` as TOP-EVENT.
2. Any event flagged as TOP-EVENT must normalize to `importance=high` in view-model.
3. No mismatched badges/suffixes between table and strict output.

## Section C: API/Type Contract Changes

### C1) UI state additions
1. `showStrictOutput: boolean` (default `false`)
2. `icsExportFilterHigh: boolean`
3. `icsExportFilterMedium: boolean`

### C2) ICS query extension
1. Endpoint remains `GET /api/weekly.ics`.
2. Add optional query parameter:
- `icsImportance=high,medium`
3. Parsing rules:
- missing/empty => no filtering (all)
- accepted tokens: `high`, `medium`
- invalid tokens ignored

### C3) Server-side normalization contract
1. Introduce deterministic normalizer for UI/API boundary:
- if `isTopEvent===true` then effective importance is `high`
- if effective importance is `high`, UI must treat as TOP-EVENT class
2. No change to existing ICS mandatory fields and serialization invariants.

## Section D: Sprint Task Plan (file-level, test-level, CI-level)

### D1) File-level tasks
1. `src/app/page.tsx`
- add strict-output visibility toggle (default off)
- add ICS export filter controls for high/medium
- pass selected filters into ICS download URL
2. `src/app/uiState.ts`
- extend UI action/state helpers for toggle + filter state
3. `src/app/uiRequests.ts`
- extend ICS endpoint builder with optional `icsImportance`
4. `src/app/weeklyResponse.ts`
- add deterministic helper for effective TOP/importance consistency in UI model
5. `src/app/api/weekly.ics/route.ts`
- parse `icsImportance` and forward filter options to orchestrator/serializer path
6. `src/server/orchestrator.ts`
- apply deterministic pre-export ICS filtering on already scoped events
7. `src/core/types.ts`
- if needed, add a narrow type for ICS importance filter (`"high"|"medium"`)
8. `src/core/icsSerializer.ts`
- no structural contract changes; only input list changes via filter

### D2) Test-level tasks (minimal necessary)
1. UI contract tests
- strict toggle default off
- strict toggle on/off visibility behavior
- ICS filter control state serialization
2. Request helper tests
- `buildIcsEndpoint` with and without `icsImportance`
3. API route tests (`/api/weekly.ics`)
- no filter => all events
- high only
- medium only
- high+medium
4. Orchestrator/core tests
- equivalence rule `TOP-EVENT <=> high`
- deterministic filtered event set for ICS export
5. Regression checks
- regions scope unchanged
- strict canonical strings unchanged
- ICS invariants unchanged (`CATEGORIES`, DTSTAMP/UID determinism, CRLF/Folding)

### D3) CI-level tasks
1. Keep full gate unchanged: `lint`, `typecheck`, `unit`, `snapshot`, `build`.
2. During development run only targeted tests for touched modules.
3. Run full `verify` once at gate closure.

## Section E: Skills + Agent Rules Patch Plan

### E1) New skill package
1. Add `skills/ui-update-next-iteration-planning-gate/SKILL.md`
2. Add `skills/ui-update-next-iteration-planning-gate/agents/openai.yaml`
3. Add `skills/ui-update-next-iteration-planning-gate/references/project-gate-checklist.md`

### E2) Skill updates required in execution phase
1. `skills/economic-calendar-table-contract/*`
- include strict-toggle and ICS filter planning rules
2. `skills/outlook-ics-generator/*`
- include ICS filter input contract (selection only, no serialization drift)
3. `skills/deterministic-qa-harness/*`
- include minimal-test-cycle policy for this sprint

### E3) Agent guardrails
1. Planning phase: no code generation.
2. Execution phase: no feature drift outside this plan.
3. Preserve existing security and determinism constraints.

## Section F: RULES.md / Docs Patch Plan

### F1) RULES.md planned additions/clarifications
1. Add rule for strict-output UI visibility toggle (display behavior only, canonical content unchanged).
2. Add rule for importance/TOP equivalence (`high <=> TOP-EVENT`).
3. Add rule for ICS export filtering semantics (`high`, `medium`, OR logic, no filter=all).

### F2) Docs to update
1. `docs/IMPLEMENTATION_PLAN.md`
- new subsection: `UI Update Next Iteration`
2. `docs/NEXT_SPRINT_HANDOFF.md`
- queue entries for `V-801..V-805`
3. `README.md`
- active scope and gate status update

## Section G: Risks, Mitigations, Open Decisions

### G1) Risks
1. Risk: UI/control drift could alter strict canonical text behavior.
2. Risk: mismatch between TOP suffix and importance stars.
3. Risk: ICS filtering could accidentally bypass `regions` scope.
4. Risk: over-testing slows sprint throughput.

### G2) Mitigations
1. Add explicit strict-output visibility tests (content unchanged assertions).
2. Add bidirectional consistency tests for TOP/importance.
3. Apply ICS filtering only after existing scope filtering.
4. Enforce minimal targeted-test-first policy, then single full gate at end.

### G3) Open decisions
1. None blocking. Defaults are fixed by this plan.

## Section H: Project Gate Checklist (Go/No-Go)

1. Plan-only phase completed (no application code changes).
2. Strict-toggle behavior is explicit (`default off`) and testable.
3. TOP/importance equivalence rule is explicit and testable.
4. ICS filter contract is explicit and testable (`high`, `medium`, OR logic, no filter=all).
5. `regions` primary contract and ICS invariants are explicitly preserved.
6. Minimal test-cycle strategy is defined and does not weaken release gates.
7. RULES/docs patch scope is approved.
8. Execution authorization is explicit.

Reply with "GO" to start code generation.
