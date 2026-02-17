---
name: weekly-outlook-orchestrator
description: Orchestrate the complete weekly macro-events flow for selected countries, from week resolution and source ingestion to strict German rendering and ICS export. Use when building or updating the end-to-end weekly pipeline, API output contract, sequencing rules, and deterministic orchestration logic.
---

# Weekly Outlook Orchestrator

## Overview

Coordinate all pipeline stages in fixed order and enforce deterministic output boundaries. Use `references/pipeline-contract.md` as the authoritative stage contract.

## Workflow

1. Resolve the target week in `Europe/Berlin` (Monday to Friday).
2. Apply allowed country scope and currency mapping.
3. Load holiday constraints before source merge.
4. Ingest source data through governed fetch policy.
5. Run normalization, filtering, classification, conflict resolution, and grouping.
6. Generate strict DE text output (including canonical `All Day` lines) and ICS output.
7. Emit API payload plus metadata (`parserVersion`, generation timestamp).

## Orchestration Rules

- Keep stage order immutable unless contract version changes.
- Use pure data handoff between stages (no UI coupling).
- Reject partial output if required stages fail without fallback policy.
- Keep deterministic metadata with every run.
- Keep `regions` scope identical across strict output, table view payload, and ICS payload.
- Treat `all_day` as a first-class time kind; use exact time when available.
- Keep strict header contract: date range only (`DD.MM.YYYY – DD.MM.YYYY`).

## Deliverables

- Stage-by-stage execution contract
- Pipeline interface boundaries
- Determinism requirements for orchestration
