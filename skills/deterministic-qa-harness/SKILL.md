---
name: deterministic-qa-harness
description: Define deterministic quality assurance strategy with fixture-first parser tests, golden snapshots, contract validation, and parser-version pinning. Use when designing test architecture and CI gates for stable weekly output and ICS generation.
---

# Deterministic QA Harness

## Overview

Guarantee repeatable behavior for parsing, transformation, rendering, and ICS export across identical inputs. Use `references/test-matrix.md` as the complete test map.

## Workflow

1. Build fixture sets per source adapter and edge case.
2. Run pure-function unit tests on normalization and merge logic.
3. Run golden snapshot tests for renderer and ICS outputs.
4. Enforce API contract tests for JSON and calendar endpoints.
5. Gate CI on deterministic output and parser-version consistency.

## QA Rules

- Prefer fixtures over live network in CI.
- Treat snapshot drift as blocking unless approved update.
- Pin parser version for deterministic traceability.
- Verify bit-identical outputs for repeated deterministic runs.

## Deliverables

- End-to-end deterministic test matrix
- Snapshot governance policy
- CI acceptance gates for reproducibility
