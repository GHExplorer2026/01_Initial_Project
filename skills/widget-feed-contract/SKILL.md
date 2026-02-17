---
name: widget-feed-contract
description: Define and enforce the versioned feed contract consumed by the Windows widget without duplicating source logic.
---

# Widget Feed Contract

## Use
Use when updating feed schema, filter parameters, and deterministic response rules for widget consumption.

## Rules
1. Contract changes are versioned.
2. `regions` stays primary scope parameter.
3. `importance` and `isTopEvent` consistency is mandatory.
4. No hallucinated metrics values.

## Inputs
- `src/core/types.ts`
- `src/core/scope.ts`
- `docs/WIDGET_FEED_CONTRACT.md`

## Outputs
- Updated feed contract spec
- Contract test matrix
