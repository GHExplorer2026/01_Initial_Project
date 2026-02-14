# V0_1_1_EVIDENCE.md

## Purpose
Track concrete evidence for closing `v0.1.1` release gates (`T-103`, `T-104`).

## Evidence Checklist

### 1) Local Node-20 Gate
- Command:
  - `npm run verify:release`
- Result:
  - `PASS` (`unit`, `snapshot`, `lint`, `typecheck`, `build`)
  - `92 / 92 tests passed`
- Operator:
  - `User (maloe)`
- Timestamp:
  - `2026-02-14 18:23 (local shell output)`

### 2) GitHub Release Gate Workflow
- Workflow:
  - `Release Gate` (`.github/workflows/release-gate.yml`)
- Ref:
  - `main`
- Result:
  - `TRIGGERED` (auto on push to `main`)
  - `PENDING VERIFICATION`
  - `BLOCKED FROM AGENT` (cannot resolve `api.github.com` to read run metadata)
- Run URL:
  - `PENDING`
- Artifacts:
  - `release-gate-test-reports`
  - `release-gate-app.log`
- Trigger note:
  - This evidence update commit triggers a new `Release Gate` run automatically.
- Success marker file (auto-committed by workflow on pass):
  - `docs/release-gate-last-success.json`
- Marker diagnostics:
  - includes `step_outcomes.install|verify|smoke` for deterministic failure isolation.
  - includes `smoke_log_tail_b64` with app log tail for smoke-stage debugging without Actions API access.
  - includes `smoke_check_tail_b64` with `scripts/smoke_api.sh` output tail.
- Deterministic local validator:
  - `npm run check:release-gate`
  - Pass criterion: marker has `status=success` and `sha` equals current `HEAD`.
 - Manual fallback:
  - open `https://github.com/GHExplorer2026/01_Initial_Project/actions/workflows/release-gate.yml`
  - copy latest successful run URL and paste it here

### 3) API Smoke Confirmation
- Script:
  - `scripts/smoke_api.sh http://127.0.0.1:3000 USA,EZ`
- Result:
  - `PENDING`

### 4) Release Action
- Planned tag:
  - `v0.1.1`
- Status:
  - `PENDING` (blocked by gate evidence item 2)
