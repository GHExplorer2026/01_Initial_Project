---
name: outlook-ics-generator
description: Generate RFC5545-compatible ICS output for Outlook with Europe/Berlin timezone handling, stable UIDs, CRLF line endings, folding, and mandatory event category tagging. Use when implementing calendar export for weekly macro events.
---

# Outlook ICS Generator

## Overview

Produce Outlook-compatible ICS with strict interoperability defaults and mandatory business category tagging. Use `references/ics-rfc5545-outlook-profile.md` as implementation profile.

## Workflow

1. Create `VCALENDAR` envelope with fixed metadata.
2. Emit `VTIMEZONE` for `Europe/Berlin`.
3. Build one `VEVENT` per normalized event.
4. Set deterministic `UID` and UTC `DTSTAMP`.
5. Add mandatory `CATEGORIES:Wirtschafts-Event` per event.
6. Serialize with CRLF and RFC folding.

## ICS Rules

- Every `VEVENT` must include the required category line.
- Use local event start/end in `Europe/Berlin`.
- Default duration is 15 minutes if end time absent.
- Keep output deterministic with stable UID hashing input.

## Deliverables

- ICS profile for Outlook interoperability
- Field-level VEVENT contract
- Deterministic UID strategy
