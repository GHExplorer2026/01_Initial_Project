# V0_1_1_PLAN.md

## Goal
Deliver a SPEC-safe hardening increment (`v0.1.1`) on top of `v0.1.0` without changing canonical output rules.

## Guardrails (Non-Negotiable)
1. No changes to `RULES.md` canonical strings and formatting contracts.
2. No changes to strict output semantics or ICS required fields.
3. Fixture-first CI remains mandatory (no live network in tests).
4. `regions` stays primary API parameter; `countries` remains deprecated alias.
5. Determinism must hold: same fixtures + parserVersion => byte-identical text and ICS.

## In Scope
1. Parser resilience hardening for source markup drift.
2. Fixture coverage expansion for edge DOM/time patterns.
3. Deterministic observability metadata and error classification hardening.
4. CI reliability improvements around snapshot gating and failure diagnostics.

## Out of Scope
1. New product features or new output formats.
2. RULES/SPEC changes.
3. Production live-source expansion beyond approved current adapters.

## Workstreams

## W1 Parser and Fixture Hardening
Status: Completed

1. Add fixture variants for Investing and TradingView parser edge markup:
   - missing/shifted columns
   - mixed whitespace/title variants
   - malformed timestamps
   Progress:
   - Added fixture-based parser drift cases:
     - `tests/fixtures/sources/investing_drift_rows.html`
     - `tests/fixtures/sources/tradingview_drift_payload.json`
2. Add explicit tests that malformed events are excluded (not guessed).
3. Keep `uncertain => exclude` behavior unchanged and fully covered.

### Acceptance
1. New parser fixtures are committed and deterministic.
2. Parser tests cover added variants and pass.
3. No snapshot drift in strict text or ICS.

## W2 Deterministic Metadata and Error Taxonomy
Status: Completed

1. Standardize structured server-side error categories (fetch, parse, timezone, governance).
2. Verify fallback note behavior remains canonical for each day case.
3. Ensure `meta.sourceMode`/`meta.sourcesUsed` remain always present and deterministic.
   Progress:
   - Added deterministic orchestration coverage for partial live-source failure:
     - healthy source events still render
     - no fixture fallback
     - tertiary remains off when trigger conditions are not met

### Acceptance
1. Tests validate error-to-fallback behavior without changing strict strings.
2. Metadata contract remains stable across fixture runs.

## W3 CI and Developer Reliability
Status: In Progress

1. Keep CI gate order strict: `lint`, `typecheck`, `unit`, `snapshot`, `build`.
2. Add concise troubleshooting pointers for common deterministic failures:
   - snapshot mismatch
   - parser fixture drift
   - Node baseline mismatch
3. Keep install deterministic with `npm ci` and Node 20 baseline.

### Acceptance
1. CI config and docs stay aligned.
2. Failure diagnostics are documented and actionable.

## Deliverables
1. Updated fixtures and parser-focused tests.
2. Updated QA/docs for `v0.1.1` scope and acceptance evidence.
3. Release record entry in `docs/RELEASES.md` once work is complete.

## Execution Order
1. W1 Parser and fixture hardening.
2. W2 Metadata/error taxonomy checks.
3. W3 CI/docs reliability updates.
4. Final Node-20 `npm run verify` evidence and release tagging.

## Definition of Done
1. `npm run verify` passes on Node `>=20.9.0`.
2. Test suite is green with deterministic snapshots.
3. No `RULES.md` changes required.
4. `v0.1.1` release note added with evidence links.
