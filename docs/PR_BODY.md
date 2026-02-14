## Summary
- Hardened deterministic macro-events pipeline and API contracts.
- Expanded SPEC-critical tests across core, server adapters, orchestrator, API routes, strict renderer, and ICS serializer.
- Added supporting architecture/QA/PR documentation and explicit CI snapshot gate.

## Key Fixes
- `meta.weekStartBerlinISO` / `meta.weekEndBerlinISO` now use dynamic Europe/Berlin offset (`+01:00` / `+02:00` by date).
- Kept strict output and ICS contracts stable while adding deeper regression coverage.
- Enforced and validated central `SOURCE_MODE` behavior with deterministic fixture default.
- Normalized `meta.sourcesUsed` tertiary fallback id to `tertiary:approved` for consistent source naming.
- Switched lint execution to a Next 16 compatible flat ESLint config (`eslint.config.mjs`).
- Committed Next-generated TypeScript config updates from build (`tsconfig.json`, `next-env.d.ts`).

## Validation
- `npm run verify` passes on Node `v20.20.0` / npm `10.8.2`.
- CI workflows include explicit `unit` + `snapshot` + `lint` + `typecheck` + `build`.
- Current passing tests: `89`.

## Compare
- https://github.com/GHExplorer2026/01_Initial_Project/compare/main...fix/source-mode-meta
