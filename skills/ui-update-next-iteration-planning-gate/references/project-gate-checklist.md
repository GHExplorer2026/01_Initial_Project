# Project Gate Checklist (UI Update Next Iteration)

## Gate Preconditions
1. No product code changes in planning phase.
2. Plan includes Sections A-H exactly.
3. Scope and out-of-scope are explicit.
4. API, state, and data-flow contracts are decision-complete.

## Functional Contract Checks
1. Strict Output visibility toggle exists in plan with default `off`.
2. Table remains primary UI view.
3. Bidirectional rule is explicit: `TOP-EVENT <=> Importance=high`.
4. ICS export filter semantics are explicit:
- no filter => all events
- `high` => high only
- `medium` => medium only
- `high+medium` => both classes

## Determinism and Governance Checks
1. No-hallucination metrics policy preserved.
2. `regions` remains primary query contract.
3. ICS invariants unchanged (`CATEGORIES`, deterministic `UID`/`DTSTAMP`, CRLF/Folding, VTIMEZONE).
4. Minimal test-cycle strategy documented without removing release gates.

## Acceptance Signal
All checklist items must pass before issuing `GO` for implementation.
