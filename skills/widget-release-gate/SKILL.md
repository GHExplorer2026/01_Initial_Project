---
name: widget-release-gate
description: Define and verify reproducible release gates, evidence artifacts, and rollback readiness for the desktop widget.
---

# Widget Release Gate

## Use
Use when closing implementation slices and preparing release candidates.

## Rules
1. Gates must be reproducible.
2. Every gate emits auditable evidence.
3. Rollback drill required before RC approval.
4. No gate bypass for speed.

## Inputs
- Test reports
- Build outputs
- Security and compliance results

## Outputs
- Gate status report
- RC evidence package
- Go/No-Go decision log
