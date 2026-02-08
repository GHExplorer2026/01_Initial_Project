---
name: repo-bootstrap
description: "Bootstrap a new repository with practical engineering standards: folder layout, baseline documentation, linting and testing gates, CI defaults, and delivery hygiene. Use when initializing a codebase, standardizing team conventions, or hardening a prototype into a maintainable project repository."
---

# Repo Bootstrap

## Overview

Create a clean, repeatable repository baseline so teams can ship safely from day one. Use `references/bootstrap-checklist.md` as a standard checklist.

## Workflow

1. Define repository conventions
- Choose monorepo or single package layout.
- Define branch strategy, commit style, and PR expectations.

2. Set project scaffolding
- Create top-level folders (`src`, `tests`, `docs`, and optional `scripts`).
- Add `README`, `LICENSE`, and environment example files.

3. Establish quality gates
- Enable formatter, linter, and static checks for the chosen stack.
- Configure tests and minimum coverage policy.

4. Configure CI defaults
- Add pipeline jobs for install, lint, test, build.
- Add fast-fail behavior and cache policy.

5. Harden dependency management
- Lock dependency versions where possible.
- Add dependency update cadence and security audit checks.

6. Finalize project hygiene
- Add issue and PR templates.
- Add CODEOWNERS or ownership notes.
- Document local run/test/build commands.

## Output Rules

- Prefer minimal defaults that can evolve.
- Fail CI on lint/test/build errors.
- Keep bootstrap output stack-specific and executable.
- Add TODO markers only when ownership and deadline are known.

## Deliverables

- Repository baseline checklist completion
- CI workflow skeleton
- Updated `README` with setup and run commands
