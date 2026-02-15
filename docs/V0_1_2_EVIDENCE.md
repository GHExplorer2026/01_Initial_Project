# V0_1_2_EVIDENCE.md

## Purpose
Track concrete evidence for closing `v0.1.2` release gates.

## Evidence Checklist

### 1) Local/CI Verify Gate
- Command:
  - `TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run verify:release`
- Result:
  - `PASS`
  - `unit`: pass
  - `snapshot`: pass
  - `lint`: pass
  - `typecheck`: pass
  - `build`: pass
  - tests: `105 / 105` passed
- Notes:
  - Default shell Node is `18.19.1`; Node 20 binary from `~/.nvm/versions/node/v20.20.0/bin` was used.
  - `TMPDIR=/tmp` avoids Windows temp directory permission issues in Vitest.

### 2) GitHub Release Gate Workflow
- Workflow:
  - `Release Gate` (`.github/workflows/release-gate.yml`)
- Ref:
  - `main`
- Result:
  - `PASS`
  - `install=success`, `verify=success`, `smoke=success`
- Run URL:
  - `https://github.com/GHExplorer2026/01_Initial_Project/actions/runs/22034113407`
- Success marker file:
  - `docs/release-gate-last-success.json`
- Validation command:
  - `npm run check:release-gate`
- Current local state:
  - marker commit synced locally (`a294aa2`)
  - marker `sha` equals validated release-doc commit `1791e70d823fb44919a14401d3e25fd65fdff761`

### 3) UI Contract Evidence
- Added tests:
  - `tests/scopeState.ui.test.ts`
  - `tests/page.ui.contract.test.ts`
- Result:
  - `PASS` (covered within Node-20 verify run)

### 4) Release Action
- Planned tag:
  - `v0.1.2`
- Status:
  - `READY` (all gates closed)
