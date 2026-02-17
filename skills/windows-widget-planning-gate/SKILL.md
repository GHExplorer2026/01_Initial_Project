---
name: windows-widget-planning-gate
description: Create a decision-complete implementation plan for the Windows Desktop Widget (Option C) with strict gates and no code generation in planning phase.
---

# Windows Widget Planning Gate

## Use
Use when preparing the Windows desktop widget scope, contracts, and gates before implementation.

## Guardrails
1. No code generation in planning phase.
2. Option C is default unless explicitly changed.
3. No direct source scraping in widget scope.
4. Contracts must be explicit and testable.

## Inputs
- `docs/WIDGET_IMPLEMENTATION_PLAN.md`
- `docs/WIDGET_FEED_CONTRACT.md`
- `docs/WIDGET_SETTINGS_CONTRACT.md`
- `docs/WIDGET_STYLE_GUIDE.md`
- `RULES.md`

## Outputs
- Approved implementation plan
- Gate checklist
- Decision log and assumptions
- Style-guide alignment matrix (adopted / deferred / out-of-scope)
