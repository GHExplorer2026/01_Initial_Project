---
name: widget-ticker-ui-contract
description: Define deterministic ticker rendering contract for desktop widget, including top-event emphasis and metric display.
---

# Widget Ticker UI Contract

## Use
Use when defining event row formatting, ticker sequence, and visual emphasis rules.

## Rules
1. Top events are bold.
2. Metrics shown as `Actual`, `Forecast`, `Previous`.
3. Missing metrics rendered as `n/a`.
4. All Day events render with `All Day` label.

## Inputs
- `docs/WIDGET_IMPLEMENTATION_PLAN.md`
- `docs/WIDGET_FEED_CONTRACT.md`

## Outputs
- UI rendering contract
- UI contract test cases
