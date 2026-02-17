# V0_1_8_EVIDENCE.md

## Purpose
Record evidence for `v0.1.8` from planning gate through execution closure.

## Scope of This Evidence
1. Planning gate package.
2. Post-gate implementation for:
   - strict-output visibility toggle (`default off`)
   - `TOP-EVENT <=> importance=high` consistency
   - ICS importance filter (`high`, `medium`, OR semantics)
3. Deterministic verification and contract validation.

## Gate Checklist Validation

### 1) Skill Package Added
- Status: `PASS`
- Artifacts:
  - `skills/ui-update-next-iteration-planning-gate/SKILL.md`
  - `skills/ui-update-next-iteration-planning-gate/agents/openai.yaml`
  - `skills/ui-update-next-iteration-planning-gate/references/project-gate-checklist.md`

### 2) Next Iteration Plan Generated
- Status: `PASS`
- Artifact:
  - `docs/V0_1_8_PLAN.md`
- Validation:
  - Contains Sections `A` to `H`.
  - Includes required contracts:
    - strict-output toggle (`default off`)
    - `TOP-EVENT <=> importance=high`
    - ICS export filter (`high`, `medium`, OR semantics, none => all)

### 3) Gate Review Against Checklist
- Status: `PASS`
- Checklist source:
  - `skills/ui-update-next-iteration-planning-gate/references/project-gate-checklist.md`
- Result:
  - No blocking gaps found in planning output.

### 4) Planning-Phase Code Freeze
- Status: `PASS`
- Validation:
  - No app code files were changed for this planning package.

## Execution Evidence (after `GO`)

### 5) Implemented Contracts
- Status: `PASS`
- Scope:
  - Strict output toggle in UI (default hidden).
  - ICS export filter controls (high/medium) wired to `icsImportance`.
  - Deterministic TOP/importance normalization in UI + orchestrator.

### 6) Test and Build Gates
- Status: `PASS`
- Command:
  - `TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run verify`
- Result:
  - `unit`: pass (`145/145`)
  - `snapshot`: pass (`145/145`)
  - `lint`: pass
  - `typecheck`: pass
  - `build`: pass
  - `check:next-env`: pass

### 7) Targeted Contract Tests
- Status: `PASS`
- Covered slices:
  - UI toggle contract (`tests/page.ui.contract.test.ts`)
  - ICS query helper contract (`tests/uiRequests.test.ts`)
  - ICS route filter parsing (`tests/api.weekly-ics.route.test.ts`)
  - TOP/importance normalization (`tests/weeklyResponse.ui.test.ts`, `tests/calendarTable.ui.test.ts`)
  - ICS filtering semantics in orchestration (`tests/orchestrator.test.ts`)

## Decision
`v0.1.8` implementation slice is complete and verification-green locally in Node 20 baseline.

## Release-Gate Closure
- Status: `PASS`
- Validation command:
  - `PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run check:release-gate`
- Run details:
  - `run_id=22108297122`
  - `steps=install:success,verify:success,smoke:success`
  - `run_url=https://github.com/GHExplorer2026/01_Initial_Project/actions/runs/22108297122`
