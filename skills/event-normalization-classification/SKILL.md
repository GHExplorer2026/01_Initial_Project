---
name: event-normalization-classification
description: Normalize raw economic event records into deterministic internal structures, resolve time kinds (exact/all-day), convert to Europe/Berlin time, and classify events into A-F categories with explicit keyword logic. Use when implementing data normalization and category assignment.
---

# Event Normalization Classification

## Overview

Convert heterogeneous source records into strict internal events and deterministic category outcomes. Use `references/classification-rules-af.md` for category definitions.

## Workflow

1. Parse raw source fields into canonical internal fields.
2. Convert timestamps to `Europe/Berlin`.
3. Resolve deterministic time kind (`exact` or `all_day`), excluding tentative/missing.
4. Normalize titles and apply category matching for timed events.
5. Attach metrics (`importance`, `actual`, `forecast`, `previous`) with provenance-safe defaults.
6. Mark `isTopEvent` using explicit top-event map.

## Normalization Rules

- Keep `all_day` and `exact` as explicit time kinds.
- Drop tentative and no-time records.
- Keep normalized title stable for dedupe consistency.
- Keep category logic deterministic and versioned.
- Emit `hasExactTime` explicitly for downstream checks.
- Never infer metric values when source fields are empty.

## Deliverables

- Canonical event shape contract
- A-F rule mapping
- TOP-EVENT mapping contract
