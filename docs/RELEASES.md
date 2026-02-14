# RELEASES.md

## v0.1.0 (2026-02-14)

### Scope
- Merged `fix/source-mode-meta` into `main`.
- Finalized deterministic Macro Events Weekly Outlook baseline per `RULES.md` and `docs/IMPLEMENTATION_PLAN.md`.

### Highlights
- Deterministic core/server/UI pipeline with strict DE output and Outlook ICS export.
- API contract with primary `regions` and deprecated `countries` alias handling.
- Guaranteed JSON meta fields:
  - `meta.sourceMode`
  - `meta.sourcesUsed`
- ICS invariants enforced in tests:
  - CRLF + folding
  - VTIMEZONE Europe/Berlin
  - deterministic UID + DTSTAMP
  - `CATEGORIES:Wirtschafts-Event` in every VEVENT

### Quality Evidence
- Node 20 verification run reported green:
  - `unit`: pass
  - `snapshot`: pass
  - `lint`: pass
  - `typecheck`: pass
  - `build`: pass
  - tests: `89 passed`

### References
- `docs/QA_STATUS.md`
- `docs/PR_SUMMARY.md`
- `docs/PR_BODY.md`
- `docs/MERGE_STEPS.md`

## Next Planned: v0.1.1

### Focus
- Parser/fixture hardening and deterministic reliability improvements only.
- No product-scope expansion and no canonical output contract changes.

### Planning Reference
- `docs/V0_1_1_PLAN.md`
- `docs/V0_1_1_RELEASE_DRAFT.md`
