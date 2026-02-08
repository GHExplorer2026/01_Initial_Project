---
name: event-normalization-classification
description: Normalize raw economic event records into deterministic internal structures, enforce exact-time filtering, convert to Europe/Berlin time, and classify events into A-F categories with explicit keyword logic. Use when implementing data normalization and category assignment.
---

# Event Normalization Classification

## Overview

Convert heterogeneous source records into strict internal events and deterministic category outcomes. Use `references/classification-rules-af.md` for category definitions.

## Workflow

1. Parse raw source fields into canonical internal fields.
2. Convert timestamps to `Europe/Berlin`.
3. Enforce exact-time-only policy.
4. Normalize titles and apply category matching.
5. Mark `isTopEvent` using explicit top-event map.

## Normalization Rules

- Drop all-day, tentative, and no-time records.
- Keep normalized title stable for dedupe consistency.
- Keep category logic deterministic and versioned.
- Emit `hasExactTime` explicitly for downstream checks.

## Deliverables

- Canonical event shape contract
- A-F rule mapping
- TOP-EVENT mapping contract
