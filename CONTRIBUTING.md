# CONTRIBUTING.md

## Branch Workflow
1. Branch from latest `main`.
2. Keep changes SPEC-safe (`RULES.md` / `docs/IMPLEMENTATION_PLAN.md`).
3. Open PR against `main`.

## Required Local Validation
- Runtime baseline:
  - `node >= 20.9.0` (see `.nvmrc` / `.node-version`)
- Run:
  - `npm run verify`
- `npm run verify` enforces the Node baseline and exits early if Node `<20.9.0`.
- This must pass before pushing:
  - unit
  - snapshot
  - lint
  - typecheck
  - build

## Review Checklist
- Use `.github/pull_request_template.md`.
- Confirm strict text and ICS contracts are unchanged unless explicitly required.
- Keep fixture-first tests deterministic (no live network in CI tests).

## Source Mode
- Default: `SOURCE_MODE=fixtures`
- Optional local live mode:
  - `TZ=Europe/Berlin NODE_OPTIONS=--dns-result-order=ipv4first SOURCE_MODE=live npm run dev`

## Direct Path Delivery Rule
Use this cadence to accelerate delivery without reducing quality:
1. Work in narrow, SPEC-safe batches (no feature drift).
2. Run targeted tests during implementation.
3. Run one full deterministic gate at batch end:
   - `TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run verify`
4. Push immediately after green verify.
5. Validate release marker:
   - `PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run check:release-gate`
