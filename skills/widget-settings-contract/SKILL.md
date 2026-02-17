---
name: widget-settings-contract
description: Define stable settings schema, defaults, and migrations for the desktop widget.
---

# Widget Settings Contract

## Use
Use when adding or changing widget settings fields, defaults, or migration rules.

## Rules
1. Settings schema is versioned.
2. Invalid values normalize to safe defaults.
3. Date preset behavior is deterministic.
4. Secrets are never stored in settings.

## Inputs
- `docs/WIDGET_SETTINGS_CONTRACT.md`
- UX filter requirements

## Outputs
- Settings schema update
- Migration checklist
