---
name: widget-timezone-dst-qa
description: Validate UTC-to-local conversion, DST behavior, and date-preset semantics for the desktop widget.
---

# Widget Timezone and DST QA

## Use
Use when validating date filtering and local time display behavior under timezone and DST boundaries.

## Rules
1. UTC is canonical internal time.
2. Windows timezone is primary display source.
3. Berlin fallback only on resolver failure.
4. DST transitions require explicit tests.

## Inputs
- Feed fixtures with UTC timestamps
- Date preset rules

## Outputs
- DST test matrix
- Timezone validation report
