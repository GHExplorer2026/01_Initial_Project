# Test Matrix

## Unit Tests
- Week resolver (weekday/weekend boundary, DST transitions)
- Country scope validation
- Normalization and time-kind filtering (`exact` + `all_day`)
- Classification A-F (positive and negative matches)
- Conflict resolver and dedupe/grouping
- Calendar table view-model (`Date + Time` formatting, weekday grouping, missing tokens)

## Snapshot Tests
- Strict DE rendered weekly text
- ICS serialization output (including category, metrics description, and CRLF/folding)

## Contract Tests
- `/api/weekly` response schema and required metadata fields
- `/api/weekly.ics` headers and structural ICS validity

## Determinism Tests
- Repeated runs with identical fixtures produce identical text and ICS bytes
- UID hash remains stable for fixed input tuple
- Parser version mismatch is surfaced in CI

## Failure and Degradation Tests
- Primary source unavailable
- Secondary unavailable
- Tertiary trigger path active
- Holiday day with no events
- Uncertain data note emission
- All-day event path in strict output and ICS (`VALUE=DATE`)
