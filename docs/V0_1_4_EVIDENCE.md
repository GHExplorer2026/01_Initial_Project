# V0_1_4_EVIDENCE.md

## Purpose
Track concrete evidence for closing `v0.1.4` release gates.

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
  - tests: `111 / 111` passed

### 2) GitHub Release Gate Workflow
- Workflow:
  - `Release Gate` (`.github/workflows/release-gate.yml`)
- Ref:
  - `main`
- Result:
  - `PASS` (release-candidate marker validation)
- Run URL:
  - `https://github.com/GHExplorer2026/01_Initial_Project/actions/runs/22035048334`
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
  - Added deprecated alias normalization route checks:
    - `tests/api.weekly.route.test.ts`
    - `tests/api.weekly-ics.route.test.ts`

### 4) Release Action
- Planned tag:
  - `v0.1.4`
- Status:
  - `PUBLISHED`
- Tag details:
  - `tag`: `v0.1.4`
  - `target`: `617cf21`
  - `push`: `origin/v0.1.4`
