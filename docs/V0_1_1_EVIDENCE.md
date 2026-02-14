# V0_1_1_EVIDENCE.md

## Purpose
Track concrete evidence for closing `v0.1.1` release gates (`T-103`, `T-104`).

## Evidence Checklist

### 1) Local Node-20 Gate
- Command:
  - `npm run verify:release`
- Result:
  - `PENDING`
- Operator:
  - `PENDING`
- Timestamp:
  - `PENDING`

### 2) GitHub Release Gate Workflow
- Workflow:
  - `Release Gate` (`.github/workflows/release-gate.yml`)
- Ref:
  - `main`
- Result:
  - `PENDING`
- Run URL:
  - `PENDING`
- Artifacts:
  - `release-gate-test-reports`
  - `release-gate-app.log`

### 3) API Smoke Confirmation
- Script:
  - `scripts/smoke_api.sh http://127.0.0.1:3000 USA,EZ`
- Result:
  - `PENDING`

### 4) Release Action
- Planned tag:
  - `v0.1.1`
- Status:
  - `PENDING`
