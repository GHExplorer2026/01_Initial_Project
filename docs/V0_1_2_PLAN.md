# V0_1_2_PLAN.md

## Goal
Deliver the UX/UI implementation phase (`v0.1.2`) on top of `v0.1.1` without changing canonical output contracts.

## Guardrails (Non-Negotiable)
1. No changes to `RULES.md` canonical strings or strict formatting contracts.
2. Strict output block remains byte-stable and isolated (`no links/sources/debug`).
3. ICS generation rules remain unchanged (`CATEGORIES:Wirtschafts-Event`, deterministic UID/DTSTAMP, CRLF/folding).
4. `regions` stays primary API parameter; `countries` remains deprecated alias behavior.
5. Test/CI determinism remains fixture-first (`SOURCE_MODE=fixtures` default).

## In Scope
1. UX/UI implementation for scope selection, generation flow, and download flow.
2. UI state persistence via URL query + `localStorage`.
3. Strict output presentation isolation in UI.
4. UI-level tests for interaction flow, a11y basics, and API contract rendering behavior.
5. Documentation updates for UI usage and release readiness.

## Out of Scope
1. Rule or output format changes in `RULES.md`.
2. New data sources or source-governance changes.
3. Pipeline semantic changes in classification/merge/renderer/ICS.
4. Product redesign outside established style constraints for current app.

## Workstreams

## W1 UI Composition and State Model
Status: Completed

1. Implement page structure in `src/app/page.tsx` with clear separation:
   - controls section
   - strict output section
   - download section
2. Keep all non-canonical UI messages outside the strict output block.
3. Define a minimal client state model:
   - selected regions
   - loading flags
   - API error surface (outside strict output)
   - last successful payload for ICS context
   Progress:
   - `src/app/page.tsx` refactored to explicit UI state (`selected`, `loading`, `error`, `sourceMode`, `sourcesUsed`, `hasGenerated`, `hydrated`).
   - Strict output remains isolated in dedicated `<pre>` without injected status/debug text.

### Acceptance
1. UI renders on desktop and mobile.
2. Strict output block is visually and structurally isolated.
3. No change to strict text content semantics.

## W2 Region Scope UX
Status: Completed

1. Build checkbox grid for 8 regions (USA, EZ, UK, JP, CH, CA, AU, NZ).
2. Implement `Alle` and `Keine` actions.
3. Synchronize selection with:
   - URL query: `regions=...`
   - `localStorage` persistence
4. Ensure deterministic normalization order for query serialization.
   Progress:
   - Added `src/app/scopeState.ts` with deterministic region normalization/serialization based on canonical region order.
   - `Alle`/`Keine` and checkbox toggles now use canonical ordering.

### Acceptance
1. Region selection survives refresh and deep links.
2. Query serialization is stable and deterministic.
3. `regions` is always primary in generated requests.

## W3 Generate Flow and Strict Output Rendering
Status: Completed

1. Implement generate action calling `GET /api/weekly?regions=...`.
2. Render strict block in `<pre>` exactly as provided by API `renderedText`.
3. Surface non-blocking meta/status UI outside strict block only.
4. Handle empty/error states without mutating strict output content.
   Progress:
   - Generate action keeps strict output payload untouched and surfaces status/meta outside strict block.
   - Initial non-generated hint moved outside `<pre>`.

### Acceptance
1. Strict block displays API text 1:1.
2. No added prose/links/debug data inside strict block.
3. Canonical hint lines remain unchanged in strict text.

## W4 ICS Download UX
Status: Completed

1. Implement download action for `GET /api/weekly.ics?regions=...`.
2. Support browser-native download behavior.
3. Optional enhanced path selection (where supported) without changing API behavior.
4. Preserve deterministic filename handling from API response.
   Progress:
   - Download action remains scope-bound and disabled when no regions selected.
   - No changes to API/ICS contract behavior.

### Acceptance
1. ICS download works for current scope.
2. Download flow does not affect strict output rendering.
3. No ICS contract changes.

## W5 UI Tests and A11y Baseline
Status: In Progress

1. Add interaction tests for:
   - checkbox toggles
   - `Alle` / `Keine`
   - URL + `localStorage` synchronization
2. Add render contract tests:
   - strict block unchanged
   - status/meta remains outside strict block
3. Add basic a11y checks:
   - keyboard navigation for controls/buttons
   - focus visibility
   - label-to-control linkage
   Progress:
   - Added deterministic unit tests for UI scope-state logic in `tests/scopeState.ui.test.ts`.
   - Added UI contract markup tests in `tests/page.ui.contract.test.ts` (strict-output isolation, fieldset/legend, stable region ids).
   - Updated page semantics (`fieldset/legend`, label `htmlFor`, `role=alert`, `aria-live`) in `src/app/page.tsx`.
   - Full DOM interaction/a11y checks pending Node-20 test runtime in local shell.

### Acceptance
1. UI tests pass deterministically in CI.
2. Existing snapshots and backend contracts remain unchanged.
3. No regressions in strict output/ICS tests.

## W6 Release Preparation (`v0.1.2`)
Status: Planned

1. Update docs (`README.md`, `docs/QA_STATUS.md`, `docs/RELEASES.md`) with UI phase evidence.
2. Run release gates:
   - `npm run verify:release`
   - GitHub `Release Gate` workflow success marker
3. Prepare release note focused on UX/UI completion without rule drift.

### Acceptance
1. All CI gates green.
2. Release evidence documented with run URL and marker status.
3. Tagging readiness confirmed.

## Risk Register (`v0.1.2`)
1. Risk: UI adds non-canonical text into strict block.
   - Impact: High
   - Mitigation: strict block isolation tests + code review guardrail.
2. Risk: scope persistence mismatch (`URL` vs `localStorage`).
   - Impact: Medium
   - Mitigation: deterministic precedence tests and hydration checks.
3. Risk: UI changes accidentally alter API request contract.
   - Impact: High
   - Mitigation: endpoint/query contract tests and typed request helpers.
4. Risk: visual changes regress accessibility.
   - Impact: Medium
   - Mitigation: keyboard/focus checks and contrast verification in UI tests.
5. Risk: CI flakiness in end-to-end UI assertions.
   - Impact: Medium
   - Mitigation: fixture-based mocks and deterministic test clocks/data.

## Task Backlog
1. `U-201` Implement page shell and state model.
2. `U-202` Implement region grid + `Alle`/`Keine`.
3. `U-203` Implement URL/localStorage persistence logic.
4. `U-204` Implement weekly generate flow and strict `<pre>` rendering.
5. `U-205` Implement ICS download flow.
6. `U-206` Add UI interaction and a11y baseline tests.
7. `U-207` Run full quality gates and update release evidence docs.

## Execution Order
1. W1 (UI composition/state)
2. W2 (scope UX)
3. W3 (generate + strict rendering)
4. W4 (download flow)
5. W5 (tests/a11y)
6. W6 (release preparation)

## Definition of Done
1. UI flow steps 1-3 from `docs/IMPLEMENTATION_PLAN.md` are implemented.
2. Strict output and ICS contracts remain unchanged and fully green.
3. Deterministic tests pass in CI (`lint`, `typecheck`, `unit`, `snapshot`, `build`, release gate).
4. `v0.1.2` release docs are complete and evidence-backed.
