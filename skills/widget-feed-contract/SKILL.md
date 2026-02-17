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
5. Widget consumer must not send deprecated `countries` alias.
6. Widget preserves feed order after filtering.

## Inputs
- `src/core/types.ts`
- `src/core/scope.ts`
- `docs/WIDGET_FEED_CONTRACT.md`
- `docs/WIDGET_STYLE_GUIDE.md`

## Outputs
- Updated feed contract spec
- Contract test matrix
