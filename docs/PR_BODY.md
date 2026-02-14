## Summary
- Hardened deterministic macro-events pipeline and API contracts.
- Expanded SPEC-critical tests across core, server adapters, orchestrator, API routes, strict renderer, and ICS serializer.
- Added supporting architecture/QA/PR documentation and explicit CI snapshot gate.

## Key Fixes
- `meta.weekStartBerlinISO` / `meta.weekEndBerlinISO` now use dynamic Europe/Berlin offset (`+01:00` / `+02:00` by date).
- Kept strict output and ICS contracts stable while adding deeper regression coverage.
- Enforced and validated central `SOURCE_MODE` behavior with deterministic fixture default.

## Validation
- `npm run verify` passes.
- CI workflows include explicit `unit` + `snapshot` + `lint` + `typecheck` + `build`.
- Current passing tests: `85`.

## Compare
- https://github.com/GHExplorer2026/01_Initial_Project/compare/main...fix/source-mode-meta
