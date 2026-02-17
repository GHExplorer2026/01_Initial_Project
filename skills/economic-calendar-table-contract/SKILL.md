---
name: economic-calendar-table-contract
description: Define and enforce the deterministic UI table contract for the macro-events calendar view, including Date+Time formatting, weekday grouping, missing-token policy, and strict-output isolation. Use when implementing or reviewing the UI Update sprint table behavior.
---

# Economic Calendar Table Contract

## Overview

Provide an Investing-style economic calendar table while keeping the strict-output block canonical and unchanged except for approved contract updates. This skill is UI-contract focused and must stay source-governed.

## Workflow

1. Consume normalized weekly API payload (`events`, `days`, `meta`) without mutating strict text.
2. Build day-grouped table rows with deterministic ordering.
3. Render fixed table columns and canonical cell formats.
4. Apply missing-token policy (`—`) and no-hallucination behavior for metrics.
5. Validate table output against fixture-based UI contract tests.

## Contract Rules

- Fixed header order:
  `Date + Time | Currency | Event | Importance | Actual | Forecast | Previous`.
- `Date + Time` cell format:
  - exact time: `DD.MM.YYYY, HH:MM`
  - all-day: `DD.MM.YYYY, All Day`
- Weekday grouping must remain visible per day block.
- Importance display uses deterministic symbols (`★☆☆`, `★★☆`, `★★★`, `—`).
- Strict-output isolation is mandatory: no table/debug metadata inside strict `<pre>`.

## Deliverables

- Table rendering contract
- Deterministic row/cell formatting rules
- UI contract test checklist
