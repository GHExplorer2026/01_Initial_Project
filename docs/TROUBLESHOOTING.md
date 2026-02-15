# TROUBLESHOOTING.md

## 1) `vitest` startup error (`ERR_REQUIRE_ESM`) in local workspace

Symptom:
- `npm run unit` or `npm run verify` fails while loading `vitest.config.ts`
- error mentions `require() of ES Module ... vite/dist/node/index.js`

Observed environment:
- Node `v18.19.x`
- npm `9.2.0`

Recommended paths:
1. Use Node `>=20.9.0` (project baseline in `package.json`, `.nvmrc`, `.node-version`).
2. Prefer CI as source of truth (Node 20 runner).
3. For local runs, use the deterministic check flow in a clean environment:
   - `TMPDIR=/tmp TMP=/tmp TEMP=/tmp npm run verify`
4. If local npm cache/permissions are problematic, force writable cache:
   - `NPM_CONFIG_CACHE=/tmp/npm-cache npm ci --registry=https://registry.npmjs.org/`
5. `npm run verify` now fails fast with a clear message when Node `<20.9.0`.

## 2) npm process hangs / no output

Symptom:
- `npm ci` or `npm install` appears stuck without output.

Mitigation:
1. Ensure no previous npm process is still running.
2. Use explicit cache and registry:
   - `NPM_CONFIG_CACHE=/tmp/npm-cache NPM_CONFIG_REGISTRY=https://registry.npmjs.org/ npm ci`
3. Use DNS and retry options when needed:
   - `NODE_OPTIONS=--dns-result-order=ipv4first`
   - `NPM_CONFIG_FETCH_RETRIES=5`
   - `NPM_CONFIG_FETCH_RETRY_MINTIMEOUT=20000`
   - `NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=120000`

## 2.1) CI unit/snapshot failures

Symptom:
- CI fails in `unit` or `snapshot` step.

Mitigation:
1. Download CI artifact (`ci-test-reports` or `quality-gates-test-reports`).
2. Inspect JUnit XML:
   - `artifacts/vitest-unit.xml`
   - `artifacts/vitest-snapshot.xml`
3. Re-run locally on Node `>=20.9.0`:
   - `npm run unit`
   - `npm run snapshot`

## 3) Git push DNS failures

Symptom:
- `Could not resolve hostname github.com`

Mitigation:
1. Confirm DNS resolution:
   - `getent hosts github.com api.github.com registry.npmjs.org`
2. Force IPv4 preference for Node/npm-related network calls:
   - `export NODE_OPTIONS=--dns-result-order=ipv4first`
3. Retry git operations:
   - `git fetch origin main --prune`
   - `git pull --ff-only`
   - `git push origin main`
4. If DNS is still unstable, execute release/build actions in CI and treat CI as source of truth.

## 4) `next-env.d.ts` toggles between `.next/types` and `.next/dev/types`

Symptom:
- `next-env.d.ts` changes unexpectedly after local `next dev` / `next build`.

Policy:
1. Keep repository baseline aligned to:
   - `import "./.next/types/routes.d.ts";`
2. If local tooling flips to `.next/dev/types/...`, reset before commit:
   - `git checkout -- next-env.d.ts`

## 5) Production startup mismatch with standalone builds

Symptom:
- App builds with `output: "standalone"` but production startup uses `next start`.

Mitigation:
1. Use standalone runtime startup:
   - `npm run build`
   - `npm run start`
2. Current `npm start` is aligned to:
   - `node .next/standalone/server.js`
3. Optional diagnostic fallback:
   - `npm run start:next`

## 6) Release gate marker mismatch after new commits

Symptom:
- `npm run check:release-gate` fails although workflow run shows success.
- output shows marker `sha` behind current `HEAD`.

Mitigation:
1. Sync local branch and marker:
   - `git fetch origin main --prune`
   - `git pull --ff-only`
2. Re-check marker:
   - `PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run check:release-gate`
3. If still mismatched, wait for marker commit propagation and retry.
4. Use diagnostics from `check:release-gate` output:
   - `run_id`
   - `steps=install:...,verify:...,smoke:...`
   - decoded `smoke_check_tail` and `smoke_log_tail` on failure
5. Treat CI marker as source of truth; do not bypass with manual status assumptions.
