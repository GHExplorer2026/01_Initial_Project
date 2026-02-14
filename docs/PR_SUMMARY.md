# PR Summary — `fix/source-mode-meta`

## Scope
- Deterministic Macro Events Weekly Outlook app hardening per `RULES.md` and `docs/IMPLEMENTATION_PLAN.md`.
- Compare URL:
  - `https://github.com/GHExplorer2026/01_Initial_Project/compare/main...fix/source-mode-meta`

## Main Outcomes
- Added guaranteed API meta fields:
  - `meta.sourceMode`
  - `meta.sourcesUsed`
- Enforced centralized source mode switching in orchestrator (`fixtures` default, `live` optional).
- Kept strict output and ICS contracts unchanged while expanding verification depth.
- Added dynamic Europe/Berlin offset handling for:
  - `meta.weekStartBerlinISO`
  - `meta.weekEndBerlinISO`
- Extended CI with explicit snapshot gate.

## Quality Gates
- Local deterministic gate:
  - `npm run verify`
- CI gates:
  - `lint`
  - `typecheck`
  - `unit`
  - `snapshot`
  - `build`
- Current passing tests: `85`

## Test Expansion Highlights
- Core:
  - classifier, normalize, weekResolver (incl. DST/weekend edges), merge/dedupe/group.
- Server adapters:
  - live parsing, request parameter contracts, error handling, fixture fallback behavior.
- API routes:
  - `regions` primary, `countries` deprecated alias, conflict `400`, invalid-input fallbacks.
- Orchestrator:
  - source priority behavior, tertiary trigger/non-trigger, fallback note behavior, strict line formatting.
- ICS:
  - CRLF/folding, mandatory VEVENT fields, deterministic UID/DTSTAMP, midnight boundary.

## Documentation Added/Updated
- `ARCHITECTURE.md`
- `docs/QA_STATUS.md`
- `docs/TROUBLESHOOTING.md`
- `CONTRIBUTING.md`
- `README.md` (snapshot, docs references, verify command)
