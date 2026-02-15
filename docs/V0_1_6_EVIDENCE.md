# V0_1_6_EVIDENCE.md

## Purpose
Track concrete evidence for closing `v0.1.6` release gates.

## Evidence Checklist

### 1) Local/CI Verify Gate
- Command:
  - `TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run verify:release`
- Result:
  - `PASS`
  - tests: `115 / 115` passed
  - `unit`: pass
  - `snapshot`: pass
  - `lint`: pass
  - `typecheck`: pass
  - `build`: pass

### 2) GitHub Release Gate Workflow
- Workflow:
  - `Release Gate` (`.github/workflows/release-gate.yml`)
- Ref:
  - `main`
- Result:
  - `PASS` (release-candidate marker validation)
- Run URL:
  - `https://github.com/GHExplorer2026/01_Initial_Project/actions/runs/22035813418`
- Run ID:
  - `22035813418`
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

### 4) Release Action
- Planned tag:
  - `v0.1.6`
- Status:
  - `PUBLISHED`
- Tag details:
  - `tag`: `v0.1.6`
  - `target`: `a2848c5`
  - `push`: `origin/v0.1.6`
