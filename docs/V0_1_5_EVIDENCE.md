# V0_1_5_EVIDENCE.md

## Purpose
Track concrete evidence for closing `v0.1.5` release gates.

## Evidence Checklist

### 1) Local/CI Verify Gate
- Command:
  - `TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run verify:release`
- Result:
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
- Success marker file:
  - `docs/release-gate-last-success.json`
- Validation command:
  - `npm run check:release-gate`

### 3) SPEC Invariant Evidence
- Strict output snapshots:
  - `PENDING`
- ICS snapshots (CRLF/folding/mandatory category):
  - `PENDING`
- Scope contract tests (`regions` primary):
  - `PENDING`

### 4) Release Action
- Planned tag:
  - `v0.1.5`
- Status:
  - `PENDING`
- Tag details:
  - `tag`: `v0.1.5`
  - `target`: `TBD`
  - `push`: `origin/v0.1.5`
