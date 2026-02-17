# Table Schema and Cell Rules

## Header Schema
- `Date + Time`
- `Currency`
- `Event`
- `Importance`
- `Actual`
- `Forecast`
- `Previous`

## Date + Time Formatting
- Timed event: `DD.MM.YYYY, HH:MM`
- All-day event: `DD.MM.YYYY, All Day`

## Importance Mapping
- `low` -> `★☆☆`
- `medium` -> `★★☆`
- `high` -> `★★★`
- `unknown` -> `—`

## Metrics Missing Token
- UI table cells: `—`
- Values must come from source payload only; never infer.

## Grouping and Ordering
- Group rows by day (weekday header visible).
- Inside a day:
  - all-day rows first
  - then timed rows ascending by time
  - then deterministic tie-breaks (currency, title).

## Isolation Rule
- Strict output block remains canonical and independent.
- Table diagnostics or source details must not leak into strict output.
