# V0_1_2_EVIDENCE.md

## Purpose
Track concrete evidence for closing `v0.1.2` release gates.

## Evidence Checklist

### 1) Local/CI Verify Gate
- Command:
  - `npm run verify:release`
- Result:
  - `PENDING`
- Notes:
  - Local shell currently Node 18; run full verify on Node `>=20.9.0` / CI.

### 2) GitHub Release Gate Workflow
- Workflow:
  - `Release Gate` (`.github/workflows/release-gate.yml`)
- Ref:
  - `main`
- Result:
  - `PENDING` for latest `v0.1.2` commit chain
- Run URL:
  - `PENDING`
- Success marker file:
  - `docs/release-gate-last-success.json`
- Validation command:
  - `npm run check:release-gate`

### 3) UI Contract Evidence
- Added tests:
  - `tests/scopeState.ui.test.ts`
  - `tests/page.ui.contract.test.ts`
- Result:
  - `PENDING NODE20 RUN`

### 4) Release Action
- Planned tag:
  - `v0.1.2`
- Status:
  - `PENDING`
