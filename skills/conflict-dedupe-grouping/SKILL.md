---
name: conflict-dedupe-grouping
description: Resolve cross-source event conflicts using strict priority, deduplicate equivalent records, and group same-country same-time events into single output lines. Use when implementing deterministic merge behavior before rendering.
---

# Conflict Dedupe Grouping

## Overview

Apply deterministic conflict resolution and stable grouping to produce renderer-ready event lines. Use `references/merge-priority-spec.md` as the merge contract.

## Workflow

1. Build candidate sets by normalized key.
2. Resolve conflicting fields by source priority.
3. Deduplicate equivalent records by stable dedupe key.
4. Group records sharing country + datetime into single render line.
5. Preserve provenance of winning record.

## Merge Rules

- Source priority: Investing, then TradingView, then tertiary.
- Prefer `exact` over `all_day` when both describe the same event key.
- Conflicts in title/time use highest-priority valid record after time-kind preference.
- Metrics fields are merged field-by-field with priority backfill (no overwrite of existing higher-priority values).
- Grouped line joins titles with ` / ` in stable lexical order.
- Keep chronological ordering after grouping.

## Deliverables

- Conflict winner rules
- Dedupe key contract
- Grouping output constraints
