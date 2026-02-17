---
name: source-governance-fetch
description: Enforce source governance for macro-events ingestion with strict priority (Investing, TradingView, then approved tertiary verification/backfill). Use when implementing source adapters, fallback behavior, compliance checks, and provenance constraints.
---

# Source Governance Fetch

## Overview

Define and enforce source hierarchy, fallback triggers, and compliance restrictions for all fetched event records. Use `references/approved-sources-policy.md` as policy baseline.

## Workflow

1. Fetch primary source (`Investing`) first.
2. Fetch secondary source (`TradingView`) for augmentation and conflict checks.
3. Evaluate tertiary trigger conditions only after primary/secondary pass.
4. Allow tertiary access only from approved registry.
5. Attach provenance metadata (`fetchedAtISO`, `parserVersion`, optional `urlHash`).

## Governance Rules

- Priority order is immutable: `investing > tradingview > tertiary:<name>`.
- Tertiary data cannot overwrite primary data outside defined trigger cases.
- Reuters adapter remains disabled without legal entitlement.
- Keep rate-limit and Terms-of-Service constraints explicit per source.
- Metrics provenance is field-level (`importance`, `actual`, `forecast`, `previous`):
  - backfill only when higher-priority field is empty
  - never overwrite existing Investing field values
- No hallucinated metrics: missing values must stay missing.
- `All Day` is a supported time token and must not be downgraded to missing time.

## Deliverables

- Source priority matrix
- Tertiary trigger policy
- Approved source governance checklist
