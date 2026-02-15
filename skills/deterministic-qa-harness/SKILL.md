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

## Sprint QA Mitigation Strategy

Use a 3-layer gate model per implementation slice:
1. Layer A (fast feedback): targeted tests for touched modules.
2. Layer B (determinism): full local verify in Node `>=20.9.0`.
3. Layer C (integration truth): CI release gate marker validation.

Rules:
1. Never skip Layer C on release-relevant changes.
2. Snapshot updates are only allowed with explicit rationale and reviewer sign-off.
3. If a flaky test appears, isolate root cause before adding new features in the same area.
4. Any production bug fix requires a deterministic regression test in the same commit.

## QA Rules

- Prefer fixtures over live network in CI.
- Treat snapshot drift as blocking unless approved update.
- Pin parser version for deterministic traceability.
- Verify bit-identical outputs for repeated deterministic runs.
- Keep strict-output and ICS golden artifacts aligned with exact canonical strings.
- Validate source-scope filters in both strict text and ICS outputs.
- Keep security checks tied to QA gates: dependency and source-governance changes require full CI evidence.

## Deliverables

- End-to-end deterministic test matrix
- Snapshot governance policy
- CI acceptance gates for reproducibility
