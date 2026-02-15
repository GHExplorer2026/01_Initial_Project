# V0_1_3_EVIDENCE.md

## Purpose
Track concrete evidence for closing `v0.1.3` release gates.

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
  - tests: `109 / 109` passed

### 2) GitHub Release Gate Workflow
- Workflow:
  - `Release Gate` (`.github/workflows/release-gate.yml`)
- Ref:
  - `main`
- Result:
  - `PASS` (baseline commit validation)
- Run URL:
  - `https://github.com/GHExplorer2026/01_Initial_Project/actions/runs/22034624406`
- Success marker file:
  - `docs/release-gate-last-success.json`
- Validation command:
  - `npm run check:release-gate`

### 3) SPEC Invariant Evidence
- Strict output snapshots:
  - `PASS` (covered by snapshot gate)
- ICS snapshots (CRLF/folding/mandatory category):
  - `PASS` (covered by snapshot gate)
- Scope contract tests (`regions` primary):
  - `PASS`
  - Added normalized route contract cases:
    - `tests/api.weekly.route.test.ts`
    - `tests/api.weekly-ics.route.test.ts`
  - Added live-failure fallback output contract checks:
    - `tests/orchestrator.test.ts`

### 4) Release Action
- Planned tag:
  - `v0.1.3`
- Status:
  - `READY FOR TAG`
