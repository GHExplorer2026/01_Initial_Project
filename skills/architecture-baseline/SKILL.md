---
name: architecture-baseline
description: Define a lightweight but actionable architecture baseline for a new project, including system context, core components, data boundaries, integration points, quality attributes, and ADRs. Use when a team is starting implementation, selecting architecture patterns, or aligning on technical direction before major build work.
---

# Architecture Baseline

## Overview

Create a concrete baseline architecture that is easy to review and revise. Use `references/architecture-template.md` to keep outputs structured and comparable across projects.

## Workflow

1. Define system boundary
- Identify primary users, external systems, and trust boundaries.
- Capture one-sentence system purpose.

2. Select architecture style
- Choose a default style (modular monolith, service-based, event-driven, etc.).
- Justify the choice against team size, delivery speed, and complexity.

3. Design core components
- Name core domains/components with clear ownership boundaries.
- Define contracts between components (API, events, queues, DB access).

4. Define data and integration model
- Assign source-of-truth per critical entity.
- Document integration protocols, retries, idempotency, and failure handling.

5. Set quality attributes
- Define performance, availability, security, compliance, and observability targets.
- Add guardrails for secrets, access control, and data protection.

6. Record ADRs
- Capture important decisions, alternatives considered, and consequences.
- Record unresolved decisions with decision owner and due date.

## Output Rules

- Keep diagrams text-first when possible (component lists and interfaces).
- Separate facts, assumptions, and decisions.
- Add explicit tradeoffs for every major choice.
- Flag missing architecture decisions before implementation starts.

## Deliverables

- `Architecture Baseline` document from `references/architecture-template.md`
- `ADR List` with status (`accepted`, `proposed`, `deferred`)
- `Risk Register` for technical risks and mitigations
