---
name: idea-to-prd
description: Convert rough project ideas into a practical PRD with clear scope, requirements, constraints, assumptions, and acceptance criteria. Use when starting a new product or feature, clarifying ambiguous requests, preparing handoff to design/engineering, or creating a shared project brief before implementation.
---

# Idea To Prd

## Overview

Take fragmented input and produce a scoped PRD that an implementation team can execute. Use `references/prd-template.md` as the default output structure.

## Workflow

1. Extract core context
- Identify product goal, target users, business objective, and timeline.
- List known constraints (budget, team size, compliance, platform limits).

2. Define problem and outcomes
- State the problem in one paragraph.
- Define measurable outcomes with baseline and target values.

3. Set MVP scope
- Separate `Must`, `Should`, and `Later`.
- Remove features without direct impact on the core outcome.

4. Specify requirements
- Write functional requirements as testable statements.
- Add acceptance criteria for each requirement.
- Capture non-functional requirements: reliability, performance, security, observability.

5. Resolve ambiguity
- Log assumptions explicitly.
- Add open questions with owners and deadlines.
- Flag risky areas for early validation spikes.

6. Produce final package
- Deliver PRD, assumptions log, open questions, and a first-cut milestone split.

## Output Rules

- Keep every requirement independently testable.
- Prefer short statements over long prose.
- Include at least one negative case in acceptance criteria.
- Mark unknowns clearly instead of filling gaps with guesses.

## Deliverables

- `PRD` using `references/prd-template.md`
- `Assumptions and Open Questions` section
- `MVP In/Out of Scope` table
