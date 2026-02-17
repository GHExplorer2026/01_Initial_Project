---
name: frontend-style-glass-dark
description: Apply mandatory dark glassmorphism visual system and accessibility standards for the macro-events UI, including typography, color tokens, interactive states, and keyboard navigation. Use when implementing or reviewing frontend UI styling and UX behavior.
---

# Frontend Style Glass Dark

## Overview

Define non-negotiable visual and interaction rules for the one-page macro events interface. Use `references/style-tokens-and-a11y.md` as style specification.

## Workflow

1. Apply global dark theme tokens and gradients.
2. Implement glassmorphism cards with blur, border, and depth.
3. Use typography pairing (`Inter` UI and monospace output block).
4. Add economic-calendar table view with deterministic headers and row grouping.
5. Add meaningful hover/focus/loading interactions.
6. Validate WCAG contrast and full keyboard navigation.

## Style Rules

- Dark mode is default and mandatory for v1.
- Use accent cyan and muted purple sparingly.
- Reserve red or orange highlights for top-event emphasis only.
- Keep output block monospace and copy-friendly.
- Keep dual-view UX: table-first display + untouched canonical strict-output block.
- Table header is fixed: `Date + Time | Currency | Event | Importance | Actual | Forecast | Previous`.
- Table day-grouping must stay aligned with strict-output weekday blocks.

## Deliverables

- Style token set
- Component-level interaction rules
- Accessibility acceptance checklist
