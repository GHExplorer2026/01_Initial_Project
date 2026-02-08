---
name: strict-renderer-de
description: Render deterministic German weekly macro output in a strict schema without extra prose, including fixed fallback notes for empty, holiday, weekend, or uncertain days. Use when implementing renderer formatting and golden snapshot output.
---

# Strict Renderer DE

## Overview

Generate exact output blocks for Monday to Friday with strict formatting guarantees. Use `references/output-schema-golden.md` as the renderer target format.

## Workflow

1. Receive grouped and sorted events.
2. Build day headers for target week in German locale.
3. Render per-day lines in strict schema order.
4. Emit fixed fallback note when day has no renderable events.
5. Append exact TOP-EVENT suffix where required.

## Rendering Rules

- Output includes no source links and no explanatory text.
- Day block order is always Monday to Friday.
- Empty day note text must match golden schema exactly.
- TOP-EVENT suffix must be exactly `- **TOP-EVENT**`.

## Deliverables

- Strict output schema contract
- Golden examples for renderer snapshot tests
- Fixed fallback note catalog
